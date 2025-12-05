const supabase = require("../config/supabase");

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching comments:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        ...req.body,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ id: data.id, ...data });
  } catch (e) {
    console.error("Error creating comment:", e);
    res.status(500).json({ message: "Create failed", error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting comment:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};
