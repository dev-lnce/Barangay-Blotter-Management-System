import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// This checks if the variables are actually loaded
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase Environment Variables! Check your .env.local file.")
}

export const supabase = createClient(supabaseUrl as string, supabaseKey as string)