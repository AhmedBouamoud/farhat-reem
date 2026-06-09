import { createClient } from '@supabase/supabase-js'

const URL = 'https://hjkdeaynmbgkacjqjudg.supabase.co'
const KEY = 'sb_publishable_vseBcdeZfTE_9nmFP5eMVA_vZLf8S0l'

export const supabase = createClient(URL, KEY)
