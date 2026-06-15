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
      ORDER BY b.id DESC
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
              e.title AS experience_title,
              e.location,
              e.price,
              e.image_url
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN experiences e ON b.experience_id = e.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result.rows[0];

    if (req.user.role === "User" && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only view your own booking" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pgclient.query(
      `SELECT b.*,
              e.title AS experience_title,
              e.location,
              e.price,
              e.image_url
       FROM bookings b
       JOIN experiences e ON b.experience_id = e.id
       WHERE b.user_id = $1
       ORDER BY b.id DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { experience_id, booking_date, people_count } = req.body;

    const expResult = await pgclient.query(
      `SELECT id, price, capacity, status, start_date, end_date
       FROM experiences
       WHERE id = $1`,
      [experience_id]
    );

    if (expResult.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const experience = expResult.rows[0];

    if (experience.status !== "Approved") {
      return res.status(400).json({ message: "You can only book approved experiences" });
    }

    if (booking_date < experience.start_date || booking_date > experience.end_date) {
      return res.status(400).json({ message: "Booking date must be within experience dates" });
    }

    const bookedResult = await pgclient.query(
      `SELECT COALESCE(SUM(people_count), 0) AS booked_count
       FROM bookings
       WHERE experience_id = $1
       AND status != 'Cancelled'`,
      [experience_id]
    );

    const booked_count = Number(bookedResult.rows[0].booked_count);
    const available = experience.capacity - booked_count;

    if (people_count > available) {
      return res.status(400).json({ message: "Not enough available places" });
    }

    const total_price = Number(experience.price) * Number(people_count);

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
    const user_id = req.user.id;
    const { booking_date, people_count } = req.body;

    const oldBooking = await pgclient.query(
      `SELECT * FROM bookings WHERE id=$1 AND user_id=$2`,
      [id, user_id]
    );

    if (oldBooking.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const experience_id = oldBooking.rows[0].experience_id;

    const expResult = await pgclient.query(
      `SELECT price, capacity FROM experiences WHERE id=$1`,
      [experience_id]
    );

    const experience = expResult.rows[0];

    const bookedResult = await pgclient.query(
      `SELECT COALESCE(SUM(people_count), 0) AS booked_count
       FROM bookings
       WHERE experience_id=$1
       AND id != $2
       AND status != 'Cancelled'`,
      [experience_id, id]
    );

    const booked_count = Number(bookedResult.rows[0].booked_count);
    const available = experience.capacity - booked_count;

    if (people_count > available) {
      return res.status(400).json({ message: "Not enough available places" });
    }

    const total_price = Number(experience.price) * Number(people_count);

    const result = await pgclient.query(
      `UPDATE bookings
       SET booking_date=$1,
           people_count=$2,
           total_price=$3
       WHERE id=$4 AND user_id=$5
       RETURNING *`,
      [booking_date, people_count, total_price, id, user_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pgclient.query(
      "DELETE FROM bookings WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};