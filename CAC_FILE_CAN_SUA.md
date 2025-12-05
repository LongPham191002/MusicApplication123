# 📝 Danh Sách Các File Cần Sửa Khi Chạy Trên Máy Khác

## 🎯 TÓM TẮT NHANH

**Nếu dùng chung Supabase project:**
- ✅ Chỉ cần sửa **1 file**: `musicAppFE/config/apiConfig.js`

**Nếu tạo Supabase project mới:**
- ✅ Cần sửa **3 files**: 2 file Supabase config + 1 file API config

---

## 📁 CHI TIẾT CÁC FILE

### 1. ⚠️ **QUAN TRỌNG NHẤT** - API Backend URL

**File**: `musicAppFE/config/apiConfig.js`

**Vị trí**: `/musicAppFE/config/apiConfig.js`

**Hiện tại:**
```javascript
export const API_BASE_URL = "http://localhost:8386";
```

**Cần sửa thành:**
```javascript
export const API_BASE_URL = "http://192.168.1.XXX:8386";
//                                  ^^^^^^^^^^^^^^^^
//                                  IP của máy chạy backend
```

**Cách tìm IP:**
- Chạy backend: `cd Backend_API && npm start`
- Xem IP hiển thị trong console
- Hoặc dùng lệnh: `ifconfig` (Mac/Linux) hoặc `ipconfig` (Windows)

**Lưu ý:**
- ⚠️ IP thay đổi mỗi khi đổi WiFi
- ⚠️ Backend và mobile device phải cùng WiFi
- ✅ Dùng `localhost` nếu test trên simulator/emulator

---

### 2. Backend Supabase Config (Chỉ sửa nếu tạo project mới)

**File**: `Backend_API/config/supabaseConfig.js`

**Vị trí**: `/Backend_API/config/supabaseConfig.js`

**Hiện tại:**
```javascript
const SUPABASE_CONFIG = {
  url: "https://bgegkxshfbjccgbvkhtd.supabase.co",
  serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
};
```

**Nếu dùng chung project:**
- ✅ **Giữ nguyên**, không cần sửa

**Nếu tạo project mới:**
- [ ] Vào Supabase Dashboard > Settings > API
- [ ] Copy Project URL → Điền vào `url`
- [ ] Copy service_role secret key → Điền vào `serviceRoleKey`

---

### 3. Frontend Supabase Config (Chỉ sửa nếu tạo project mới)

**File**: `musicAppFE/config/supabaseConfig.js`

**Vị trí**: `/musicAppFE/config/supabaseConfig.js`

**Hiện tại:**
```javascript
export const SUPABASE_CONFIG = {
  url: "https://bgegkxshfbjccgbvkhtd.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
};
```

**Nếu dùng chung project:**
- ✅ **Giữ nguyên**, không cần sửa

**Nếu tạo project mới:**
- [ ] Vào Supabase Dashboard > Settings > API
- [ ] Copy Project URL → Điền vào `url` (cùng URL như backend)
- [ ] Copy anon public key → Điền vào `anonKey`

---

## 🎯 QUY TRÌNH THỰC TẾ

### Bước 1: Clone Project
```bash
git clone <repository-url>
cd MusicApplication
```

### Bước 2: Cài Đặt Packages
```bash
# Backend
cd Backend_API
npm install

# Frontend
cd ../musicAppFE
npm install
```

### Bước 3: Chạy Backend và Lấy IP
```bash
cd Backend_API
npm start
```

**Ghi lại IP address** hiển thị trong console:
```
🚀 Server running at:
   - http://localhost:8386
   - http://192.168.1.100:8386  ← Ghi lại IP này
```

### Bước 4: Sửa API Config
Mở file: `musicAppFE/config/apiConfig.js`

Thay đổi:
```javascript
export const API_BASE_URL = "http://192.168.1.100:8386";
//                                  ^^^^^^^^^^^^^^^^^^^
//                                  IP từ bước 3
```

### Bước 5: Chạy Frontend
```bash
cd musicAppFE
npm start
```

---

## ✅ CHECKLIST HOÀN CHỈNH

**Setup cơ bản:**
- [ ] Clone repository
- [ ] Cài đặt packages backend (`cd Backend_API && npm install`)
- [ ] Cài đặt packages frontend (`cd musicAppFE && npm install`)

**Config (nếu dùng chung Supabase):**
- [ ] Chạy backend và lấy IP address
- [ ] Sửa `musicAppFE/config/apiConfig.js` → Thay IP
- [ ] Giữ nguyên Supabase config (dùng chung)

**Config (nếu tạo Supabase mới):**
- [ ] Tạo Supabase project mới
- [ ] Sửa `Backend_API/config/supabaseConfig.js`
- [ ] Sửa `musicAppFE/config/supabaseConfig.js`
- [ ] Sửa `musicAppFE/config/apiConfig.js` → Thay IP

**Chạy ứng dụng:**
- [ ] Backend đang chạy (`npm start` trong `Backend_API/`)
- [ ] Frontend đang chạy (`npm start` trong `musicAppFE/`)
- [ ] Test kết nối thành công

---

## 🔍 VỊ TRÍ FILE TRONG PROJECT

```
MusicApplication/
├── Backend_API/
│   └── config/
│       └── supabaseConfig.js        ← Sửa nếu tạo project mới
├── musicAppFE/
│   └── config/
│       ├── apiConfig.js             ← ⚠️ BẮT BUỘC SỬA (IP address)
│       └── supabaseConfig.js        ← Sửa nếu tạo project mới
```

---

## 💡 MẸO

1. **Lưu IP vào ghi chú** để dễ nhớ
2. **IP thay đổi khi đổi WiFi** → Nhớ sửa lại
3. **Dùng `localhost`** nếu test trên simulator
4. **Kiểm tra WiFi** trước khi test trên điện thoại thật

---

*Danh sách này giúp bạn setup dự án nhanh chóng!*

