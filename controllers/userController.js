import pgclient from "../db.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await pgclient.query(
      "SELECT id, first_name, last_name, email, role, profile_image, created_at FROM users ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "SELECT id, first_name, last_name, email, role, profile_image, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password_hash, role, profile_image } = req.body;

    const result = await pgclient.query(
      `INSERT INTO users
       (first_name, last_name, email, password_hash, role, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, role, profile_image, created_at`,
      [first_name, last_name, email, password_hash, role, profile_image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role, profile_image } = req.body;

    const result = await pgclient.query(
      `UPDATE users
       SET first_name=$1,
           last_name=$2,
           email=$3,
           role=$4,
           profile_image=$5
       WHERE id=$6
       RETURNING id, first_name, last_name, email, role, profile_image, created_at`,
      [first_name, last_name, email, role, profile_image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM users WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};