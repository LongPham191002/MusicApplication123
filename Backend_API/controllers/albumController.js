const con = require('../db/connection');

exports.getAllAlbums = (req, res) => {
  const sql = `
    SELECT al.album_id, al.title, al.cover_url, al.description, al.release_date,
           ar.stage_name AS artist_name
    FROM albums al
    JOIN artists ar ON al.artist_id = ar.artist_id
    ORDER BY al.release_date DESC;
  `;
  con.query(sql, (err, results) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getAlbumById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT al.*, ar.stage_name AS artist_name
    FROM albums al
    JOIN artists ar ON al.artist_id = ar.artist_id
    WHERE al.album_id = ?;
  `;
  con.query(sql, [id], (err, results) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    if (!results.length) 
        return res.status(404).json({ error: "Album not found" });
    res.json(results[0]);
  });
};
exports.getAlbumsByArtist = (req, res) => {
  const { artistId } = req.params;
  const sql = `
    SELECT album_id, title, cover_url, description, release_date
    FROM albums WHERE artist_id = ? ORDER BY release_date DESC;
  `;
  con.query(sql, [artistId], (err, results) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.createAlbum = (req, res) => {
  const { artist_id, title, cover_url, description, release_date } = req.body;
  if (!artist_id || !title)
    return res.status(400).json({ error: "Missing artist_id or title" });

  const sql = `
    INSERT INTO albums (artist_id, title, cover_url, description, release_date)
    VALUES (?, ?, ?, ?, ?)
  `;
  con.query(sql, [artist_id, title, cover_url || null, description || null, release_date || null], 
    (err, result) => {
        if (err) 
            return res.status(500).json({ error: err.message });
        res.json({ message: "Album created", album_id: result.insertId });
    });
};
exports.updateAlbum = (req, res) => {
  const { id } = req.params;
  const { title, cover_url, description, release_date } = req.body;

  const sql = `
    UPDATE albums
    SET title = ?, cover_url = ?, description = ?, release_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE album_id = ?
  `;
  con.query(sql, [title, cover_url, description, release_date, id], (err, result) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) 
        return res.status(404).json({ error: "Album not found" });
    res.json({ message: "Album updated successfully" });
  });
};
exports.deleteAlbum = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM albums WHERE album_id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) 
        return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) 
        return res.status(404).json({ error: "Album not found" });
    res.json({ message: "Album deleted successfully" });
  });
};  