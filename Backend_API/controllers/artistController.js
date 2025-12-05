const supabase = require("../config/supabase");

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching artists:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error("Error fetching artist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("artists")
      .insert(req.body)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ id: data.id, ...data });
  } catch (e) {
    console.error("Error creating artist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("artists")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Updated", ...data });
  } catch (e) {
    console.error("Error updating artist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("artists")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting artist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};
