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

export const createExperience = async (req, res) => {
  try {
    const {
      provider_id,
      city_id,
      title,
      description,
      category,
      location,
      duration,
      max_people,
      price,
      image_url,
    } = req.body;

    const result = await pgclient.query(
      `INSERT INTO experiences
      (provider_id, city_id, title, description, category, location, duration, max_people, price, image_url, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Pending')
      RETURNING *`,
      [
        provider_id,
        city_id,
        title,
        description,
        category,
        location,
        duration,
        max_people,
        price,
        image_url,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      provider_id,
      city_id,
      title,
      description,
      category,
      location,
      duration,
      max_people,
      price,
      image_url,
    } = req.body;

    const result = await pgclient.query(
      `UPDATE experiences
       SET provider_id=$1, city_id=$2, title=$3, description=$4,
           category=$5, location=$6, duration=$7, max_people=$8,
           price=$9, image_url=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11
       RETURNING *`,
      [provider_id, city_id, title, description, category, location, duration, max_people, price, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM experiences WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `UPDATE experiences
       SET status='Approved', updated_at=CURRENT_TIMESTAMP
       WHERE id=$1
       RETURNING *`,
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

export const rejectExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `UPDATE experiences
       SET status='Rejected', updated_at=CURRENT_TIMESTAMP
       WHERE id=$1
       RETURNING *`,
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