import pgclient from "../db.js";

export const getAllExperiences = async (req, res) => {
  try {
    const result = await pgclient.query(`
      SELECT e.*, 
             c.name AS city_name,
             u.first_name AS provider_first_name,
             u.last_name AS provider_last_name
      FROM experiences e
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN users u ON e.provider_id = u.id
      ORDER BY e.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `
      SELECT e.*, 
             c.name AS city_name,
             u.first_name AS provider_first_name,
             u.last_name AS provider_last_name
      FROM experiences e
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN users u ON e.provider_id = u.id
      WHERE e.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};