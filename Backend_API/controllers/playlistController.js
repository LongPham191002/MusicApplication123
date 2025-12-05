const supabase = require("../config/supabase");

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .select("*");
    
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    console.error("Error fetching playlists:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .insert({
        ...req.body,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json({ id: data.id, ...data });
  } catch (e) {
    console.error("Error creating playlist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ message: "Updated", ...data });
  } catch (e) {
    console.error("Error updating playlist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { error } = await supabase
      .from("playlists")
      .delete()
      .eq("id", req.params.id);
    
    if (error) throw error;
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error("Error deleting playlist:", e);
    res.status(500).json({ message: "Error", error: e.message });
  }
};
