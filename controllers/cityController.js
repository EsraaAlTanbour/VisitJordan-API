import pgclient from "../db.js";

export const getAllCities = async (req, res) => {
  try {
    const result = await pgclient.query(
      "SELECT * FROM cities ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};