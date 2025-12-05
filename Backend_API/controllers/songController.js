const supabase = require("../config/supabase");

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching songs:", e);
    res.status(500).json({ message: "Error fetching songs", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error("Error fetching song:", e);
    res.status(500).json({ message: "Error fetching song", error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("songs")
      .insert(req.body)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Created", id: data.id, ...data });
  } catch (e) {
    console.error("Error creating song:", e);
    res.status(500).json({ message: "Create failed", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("songs")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Updated", ...data });
  } catch (e) {
    console.error("Error updating song:", e);
    res.status(500).json({ message: "Update failed", error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting song:", e);
    res.status(500).json({ message: "Delete failed", error: e.message });
  }
};
