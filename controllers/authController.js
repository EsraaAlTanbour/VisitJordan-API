import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pgclient from "../db.js";

export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      phone,
      city,
      business_name,
    } = req.body;

       if (role === "Provider" && !business_name) {
      return res.status(400).json({ message: "Business name is required for providers" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isApproved = role === "Provider" ? false : true;

    const result = await pgclient.query(
      `INSERT INTO users
       (first_name, last_name, email, password_hash, role, is_approved, phone, city, business_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, first_name, last_name, email, role, is_approved, phone, city, business_name, created_at`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        role,
        isApproved,
        phone,
        city,
        role === "Provider" ? business_name : null,
      ]
    );

    res.status(201).json({
      message:
        role === "Provider"
          ? "Provider registered successfully and is waiting for admin approval"
          : "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pgclient.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
const token = jwt.sign(
  {
    id: user.id,
    role: user.role,
    is_approved: user.is_approved,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
    

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });


   
    res.json({
      message: "Login successful",
       user: {
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  role: user.role,
  is_approved: user.is_approved,
},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logout successful",
  });
};