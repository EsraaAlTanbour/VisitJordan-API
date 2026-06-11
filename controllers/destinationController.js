import pgclient from "../db.js";

// Get all destinations
export const getAllDestinations = async (req, res) => {
  try {
    const result = await pgclient.query(`
      SELECT d.*, c.name AS city_name
      FROM destinations d
      JOIN cities c ON d.city_id = c.id
      ORDER BY d.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get destination by id
export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `SELECT d.*, c.name AS city_name
       FROM destinations d
       JOIN cities c ON d.city_id = c.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create destination
export const createDestination = async (req, res) => {
  try {
    const { city_id, name, description, image_url } = req.body;

    const result = await pgclient.query(
      `INSERT INTO destinations
       (city_id, name, description, image_url)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [city_id, name, description, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update destination
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { city_id, name, description, image_url } = req.body;

    const result = await pgclient.query(
      `UPDATE destinations
       SET city_id=$1,
           name=$2,
           description=$3,
           image_url=$4
       WHERE id=$5
       RETURNING *`,
      [city_id, name, description, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete destination
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM destinations WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.json({
      message: "Destination deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};