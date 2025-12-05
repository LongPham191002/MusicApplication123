// =========================
// USERS CONTROLLER MERGED
// =========================

// Supabase DB
const supabase = require("../config/supabase");

// =========================
// GET ALL USERS
// =========================
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

// =========================
// GET USER BY ID
// =========================
exports.getById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

// =========================
// CREATE USER (SAFE VERSION)
// =========================
exports.create = async (req, res) => {
  try {
    const tokenUser = req.user; // Supabase token đã verify  
    const body = req.body;

    // ❗ KIỂM TRA BẢO MẬT:
    // userId từ client phải KHỚP với uid trong Supabase Token
    if (!tokenUser || tokenUser.uid !== body.userId) {
      return res.status(403).json({ message: "Không hợp lệ: userId mismatch" });
    }

    // Nếu client không gửi createdAt → tự thêm
    body.createdAt = body.createdAt || new Date().toISOString();

    // Lưu vào Supabase
    const { data, error } = await supabase
      .from("users")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: data.id,
      ...data,
    });

  } catch (e) {
    console.error("❌ Create user error:", e);
    res.status(500).json({ message: "Error creating user", error: e.message });
  }
};

// =========================
// UPDATE USER
// =========================
exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Updated", ...data });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

// =========================
// DELETE USER
// =========================
exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};
