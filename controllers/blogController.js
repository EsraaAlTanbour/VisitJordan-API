import pgclient from "../db.js";

export const getAllBlogs = async (req, res) => {
  try {
    const result = await pgclient.query(`
      SELECT b.*, u.first_name AS admin_first_name, u.last_name AS admin_last_name
      FROM blogs b
      LEFT JOIN users u ON b.admin_id = u.id
      ORDER BY b.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `SELECT b.*, u.first_name AS admin_first_name, u.last_name AS admin_last_name
       FROM blogs b
       LEFT JOIN users u ON b.admin_id = u.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { admin_id, title, content, image_url } = req.body;

    const result = await pgclient.query(
      `INSERT INTO blogs (admin_id, title, content, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [admin_id, title, content, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_id, title, content, image_url } = req.body;

    const result = await pgclient.query(
      `UPDATE blogs
       SET admin_id=$1, title=$2, content=$3, image_url=$4
       WHERE id=$5
       RETURNING *`,
      [admin_id, title, content, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM blogs WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};