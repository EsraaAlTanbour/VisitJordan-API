import pgclient from "../db.js";

export const getImagesByExperience = async (req, res) => {
  try {
    const { experience_id } = req.params;

    const result = await pgclient.query(
      "SELECT * FROM experience_images WHERE experience_id = $1 ORDER BY id ASC",
      [experience_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addExperienceImage = async (req, res) => {
  try {
    const { experience_id, image_url } = req.body;

    const result = await pgclient.query(
      `INSERT INTO experience_images (experience_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [experience_id, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExperienceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;

    const result = await pgclient.query(
      `UPDATE experience_images
       SET image_url = $1
       WHERE id = $2
       RETURNING *`,
      [image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteExperienceImage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM experience_images WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Experience image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};