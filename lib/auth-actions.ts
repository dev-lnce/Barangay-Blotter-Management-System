'use server'

import { createSupabaseServer, createSupabaseAdmin } from './supabase-server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUpOfficial(formData: { 
  idNumber: string; 
  password: string; 
  fullName: string;
  role: string;
}) {
  const supabaseAdmin = await createSupabaseAdmin() // Use admin client to bypass RLS if needed

  // 1. Create the user in Supabase Auth
  // Note: Adjust the email format based on whether you chose Option A or Option B above
  const emailToRegister = `${formData.idNumber}@banaybanay2.gov.ph` 

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: emailToRegister,
    password: formData.password,
    email_confirm: true, // Auto-confirm since an admin is creating it
  })

  if (authError) return { error: authError.message }

  // 2. Create their public profile record
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      id_number: formData.idNumber,
      full_name: formData.fullName,
      role: formData.role,
      status: 'Active'
    })

  if (profileError) {
    // Ideally, roll back the auth user creation here if the profile fails
    return { error: "Failed to create official profile." }
  }

  return { success: true }
}

export async function signIn(formData: { idNumber: string; password: string }) {
  const supabase = await createSupabaseServer()

  // 1. Look up the email associated with the ID Number
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id_number', formData.idNumber)
    .single()

  if (profileError || !profile) {
     return { error: "Invalid ID Number or Password." }
  }

  // 2. Authenticate using the retrieved email
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: formData.password,
  })

  if (error) {
    // Log failed login attempt
    await supabase.from('audit_logs').insert({
      user_name: 'Unknown',
      user_id: '—',
      action: 'Failed Login',
      details: `Failed attempt with ID '${formData.idNumber}'`,
      status: 'Failed',
    })

    return { error: error.message }
  }

  // Log successful login
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', data.user.id)
      .single()

    await supabase.from('audit_logs').insert({
      user_id: data.user.id,
      user_name: profile?.full_name || data.user.email || 'Unknown',
      action: 'Login',
      details: 'Successful authentication',
      status: 'Success',
    })

    // Update last_active
    await supabase
      .from('profiles')
      .update({ last_active: new Date().toISOString() })
      .eq('id', data.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_name: profile?.full_name || user.email || 'Unknown',
      action: 'Logout',
      details: 'User signed out',
      status: 'Success',
    })
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createUser(params: {
  fullName: string
  email: string
  role: string
  tempPassword: string
}) {
  const supabaseAdmin = await createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  // Map role values to display labels
  const roleMap: Record<string, string> = {
    'captain': 'Brgy. Captain',
    'secretary': 'Secretary',
    'desk-officer': 'Desk Officer',
  }

  const role = roleMap[params.role] || params.role

  // Create auth user with admin API
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: params.email,
    password: params.tempPassword,
    email_confirm: true,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  // Insert profile record
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: params.fullName,
      role,
      email: params.email,
      status: 'Active',
    })

  if (profileError) {
    return { error: profileError.message }
  }

  // Log the action
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (currentUser) {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', currentUser.id)
      .single()

    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      user_name: currentProfile?.full_name || currentUser.email || 'Unknown',
      action: 'User Created',
      details: `Created account for ${params.fullName} (${role})`,
      status: 'Success',
    })
  }

  revalidatePath('/users')
  return { success: true }
}

export async function resetUserPassword(userId: string, userEmail: string) {
  const supabaseAdmin = await createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + '!',
  })

  if (error) {
    return { error: error.message }
  }

  // Also send a password reset email
  await supabaseAdmin.auth.resetPasswordForEmail(userEmail)

  // SAFE AUDIT LOGGING: Wrap in try/catch to prevent "Auth session missing" crashes
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', currentUser.id)
        .single()

      await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        user_name: currentProfile?.full_name || currentUser.email || 'Unknown',
        action: 'Password Reset',
        details: `Reset password for ${userEmail}`,
        status: 'Success',
      })
    }
  } catch (err) {
    console.log("Skipping audit log: No active session found.")
  }

  revalidatePath('/users')
  return { success: true }
}

export async function revokeUserAccess(userId: string, userName: string) {
  const supabaseAdmin = await createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  // Disable the user in profiles
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ status: 'Inactive' })
    .eq('id', userId)

  if (error) return { error: error.message }

  // Ban the user in Supabase Auth
  await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '876000h' }) // ~100 years

  // SAFE AUDIT LOGGING
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        user_name: currentUser.email || 'Unknown',
        action: 'Access Revoked',
        details: `Revoked access for ${userName}`,
        status: 'Warning',
      })
    }
  } catch (err) {
    console.log("Skipping audit log: No active session found.")
  }

  revalidatePath('/users')
  return { success: true }
}

// NEW FUNCTION: To restore access when someone is already revoked
export async function restoreUserAccess(userId: string, userName: string) {
  const supabaseAdmin = await createSupabaseAdmin()
  const supabase = await createSupabaseServer()

  // Re-enable the user in profiles
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ status: 'Active' })
    .eq('id', userId)

  if (error) return { error: error.message }

  // Unban the user in Supabase Auth by removing the ban duration
  await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' })

  // SAFE AUDIT LOGGING
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        user_name: currentUser.email || 'Unknown',
        action: 'Access Restored',
        details: `Restored access for ${userName}`,
        status: 'Success',
      })
    }
  } catch (err) {
    console.log("Skipping audit log: No active session found.")
  }

  revalidatePath('/users')
  return { success: true }
}
