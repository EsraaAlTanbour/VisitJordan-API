import pgclient from "../db.js";

export const getAllBookings = async (req, res) => {
  try {
    const result = await pgclient.query(`
      SELECT b.*,
             u.first_name AS user_first_name,
             u.last_name AS user_last_name,
             e.title AS experience_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN experiences e ON b.experience_id = e.id
      ORDER BY b.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      `SELECT b.*,
              u.first_name AS user_first_name,
              u.last_name AS user_last_name,
              e.title AS experience_title
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN experiences e ON b.experience_id = e.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pgclient.query(
      `SELECT b.*,
              e.title AS experience_title,
              e.location,
              e.price
       FROM bookings b
       JOIN experiences e ON b.experience_id = e.id
       WHERE b.user_id = $1
       ORDER BY b.id ASC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { user_id, experience_id, booking_date, people_count, total_price } = req.body;

    const result = await pgclient.query(
      `INSERT INTO bookings
       (user_id, experience_id, booking_date, people_count, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING *`,
      [user_id, experience_id, booking_date, people_count, total_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_date, people_count, total_price, status } = req.body;

    const result = await pgclient.query(
      `UPDATE bookings
       SET booking_date=$1,
           people_count=$2,
           total_price=$3,
           status=$4
       WHERE id=$5
       RETURNING *`,
      [booking_date, people_count, total_price, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pgclient.query(
      "DELETE FROM bookings WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};