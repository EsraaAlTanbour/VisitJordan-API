import pgclient from "../db.js";

export const addLike = async (req, res) => {
  try {
    const { user_id, experience_id } = req.body;

    const result = await pgclient.query(
      `INSERT INTO likes (user_id, experience_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, experience_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pgclient.query(
      `SELECT l.*, e.title, e.description, e.price, e.image_url, e.status
       FROM likes l
       JOIN experiences e ON l.experience_id = e.id
       WHERE l.user_id = $1
       ORDER BY l.id ASC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM likes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.json({ message: "Like deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};