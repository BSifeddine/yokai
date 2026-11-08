import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://idhtcyogffmszssvrotl.supabase.co'
const supabaseAnonKey = 'sb_publishable_Xtk26dHeHGLFhnV0EpIj3A_D6cGQhSM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)