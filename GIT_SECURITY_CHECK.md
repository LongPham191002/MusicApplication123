# 🔒 Kiểm Tra Bảo Mật Trước Khi Push Lên GitHub

## ⚠️ VẤN ĐỀ PHÁT HIỆN

### File chứa thông tin nhạy cảm đang được track:

1. **`Backend_API/config/supabaseConfig.js`** ⚠️ **NGUY HIỂM**
   - Chứa **Service Role Key** (có quyền cao)
   - **KHÔNG được push lên GitHub**

2. **`musicAppFE/config/supabaseConfig.js`** ⚠️
   - Chứa anonKey (ít nguy hiểm nhưng không nên push)
   - URL Supabase project

3. **`musicAppFE/config/apiConfig.js`** ✅
   - Chỉ chứa IP address local
   - Có thể push (nhưng nên dùng localhost)

---

## ✅ GIẢI PHÁP

### Cách 1: Thêm vào .gitignore (KHUYẾN NGHỊ)

Thêm các file config thật vào `.gitignore`, chỉ push file `.example`:

```gitignore
# Supabase config files (chứa keys thật)
Backend_API/config/supabaseConfig.js
musicAppFE/config/supabaseConfig.js

# API config (optional - có thể giữ nếu muốn)
# musicAppFE/config/apiConfig.js
```

**Lưu ý:**
- File `.example` sẽ được push (không chứa keys thật)
- Mỗi người sẽ copy file `.example` và điền keys của mình

### Cách 2: Sử dụng Environment Variables

Di chuyển keys sang file `.env` và thêm vào `.gitignore`

---

## 🔧 HƯỚNG DẪN XỬ LÝ

### Bước 1: Cập nhật .gitignore

Thêm vào file `.gitignore`:

```gitignore
# Supabase Configuration (chứa keys thật)
Backend_API/config/supabaseConfig.js
musicAppFE/config/supabaseConfig.js
```

### Bước 2: Xóa file config khỏi git tracking (nếu đã commit)

Nếu file đã được commit trước đó:

```bash
# Xóa khỏi git nhưng giữ lại trên máy
git rm --cached Backend_API/config/supabaseConfig.js
git rm --cached musicAppFE/config/supabaseConfig.js

# Commit việc xóa
git commit -m "Remove sensitive config files from tracking"
```

### Bước 3: Đảm bảo file .example có sẵn

Các file này sẽ được push:
- ✅ `Backend_API/config/supabaseConfig.example.js`
- ✅ `musicAppFE/config/supabaseConfig.example.js`

---

## 📋 CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã thêm config files vào `.gitignore`
- [ ] Đã xóa config files khỏi git tracking (nếu đã commit)
- [ ] File `.example` đã có sẵn và đầy đủ
- [ ] Đã kiểm tra không còn keys thật trong các file sẽ push
- [ ] Đã test local vẫn chạy được sau khi xóa khỏi git

---

## 🎯 KẾT QUẢ

Sau khi xử lý:
- ✅ File config thật được bảo vệ (không push)
- ✅ File example được push (người khác có thể copy)
- ✅ Dự án vẫn chạy được local
- ✅ An toàn khi push lên GitHub

---

*Tài liệu này giúp bạn tránh lộ thông tin nhạy cảm trên GitHub!*

