import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fpqliiygpaglgvooyeft.supabase.co'
const supabaseAnonKey = 'sb_publishable_EbeH1qxly70l3UzKTMR5GA_qJtazG_0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)