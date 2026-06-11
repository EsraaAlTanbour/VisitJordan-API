import pgclient from "../db.js";

export const getAllCities = async (req, res) => {
  try {
    const result = await pgclient.query("SELECT * FROM cities ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgclient.query("SELECT * FROM cities WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCity = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    const result = await pgclient.query(
      `INSERT INTO cities (name, description, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    const result = await pgclient.query(
      `UPDATE cities
       SET name = $1, description = $2, image_url = $3
       WHERE id = $4
       RETURNING *`,
      [name, description, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM cities WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};