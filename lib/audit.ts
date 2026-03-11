import { createSupabaseBrowser } from './supabase-browser'

type ActionType =
  | 'Login'
  | 'Logout'
  | 'Record Created'
  | 'Record Edited'
  | 'Record Deleted'
  | 'Data Exported'
  | 'Failed Login'
  | 'Password Reset'
  | 'User Created'
  | 'Access Revoked'
  | 'Access Restored'
  | 'Status Changed'

type LogStatus = 'Success' | 'Warning' | 'Failed'

interface AuditEventParams {
  userId?: string
  userName?: string
  action: ActionType
  details: string
  status?: LogStatus
}

export async function logAuditEvent(params: AuditEventParams) {
  const supabase = createSupabaseBrowser()

  const { data: { user } } = await supabase.auth.getUser()

  let userName = params.userName || 'Unknown'
  let userId = params.userId || '—'

  if (user && !params.userName) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    userName = profile?.full_name || user.email || 'Unknown'
    userId = user.id
  }

  await supabase.from('audit_logs').insert({
    user_id: userId,
    user_name: userName,
    action: params.action,
    details: params.details,
    status: params.status || 'Success',
  })
}