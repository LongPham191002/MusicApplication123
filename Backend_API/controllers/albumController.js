const supabase = require("../config/supabase");

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("albums")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching albums:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error("Error fetching album:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("albums")
      .insert(req.body)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Created", id: data.id, ...data });
  } catch (e) {
    console.error("Error creating album:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("albums")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Updated", ...data });
  } catch (e) {
    console.error("Error updating album:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("albums")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting album:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};
