// Supabase Configuration Example for Backend
// Copy file này thành supabaseConfig.js và điền thông tin của bạn

const SUPABASE_CONFIG = {
  // Project URL từ Supabase Dashboard > Settings > API
  url: "https://xxxxxxxxxxxxx.supabase.co",
  
  // Service Role Key từ Supabase Dashboard > Settings > API > service_role secret
  // ⚠️ LƯU Ý: Key này có quyền cao, KHÔNG được commit lên Git hoặc expose ra frontend!
  serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE1MjkyMTIwLCJleHAiOjE5MzA4NjgxMjB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

module.exports = SUPABASE_CONFIG;

