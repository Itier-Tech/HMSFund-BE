const supabaseClient = require("@supabase/supabase-js");

const supabase = supabaseClient.createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_API_KEY
);

module.exports = supabase;
