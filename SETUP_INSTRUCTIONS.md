

## 📝 TÓM TẮT CÁC FILE CẦN SỬA

### 1. Backend - Supabase Config
**File**: `Backend_API/config/supabaseConfig.js`

```javascript
const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",        // ← Sửa nếu dùng project mới
  serviceRoleKey: "your-service-role-key",           // ← Sửa nếu dùng project mới
};
```

### 2. Frontend - Supabase Config
**File**: `musicAppFE/config/supabaseConfig.js`

```javascript
export const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",        // ← Sửa nếu dùng project mới
  anonKey: "your-anon-key",                          // ← Sửa nếu dùng project mới
};
```

### 3. Frontend - API Backend URL ⚠️ QUAN TRỌNG
**File**: `musicAppFE/config/apiConfig.js`

```javascript
export const API_BASE_URL = "http://192.168.1.100:8386";  // ← SỬA IP NÀY!
//                                  ^^^^^^^^^^^^^^^^^^^
//                                  IP của máy chạy backend




