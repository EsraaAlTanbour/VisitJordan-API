# 🧠 VisitJordan Backend (Express + PostgreSQL)

This is the backend API for the VisitJordan full-stack tourism platform. It provides APIs for authentication, users, cities, destinations, blogs, experiences, experience images, bookings, likes, provider requests, and admin operations.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- cors
- cookie-parser
- JWT Authentication
- Role-Based Authorization

---

## 🚀 Getting Started

```bash
npm install
npm start
```

The API runs on:

```text
http://localhost:5000
```

---

## 📁 Project Structure

```text
VisitJordan-API/
├── controllers/
│   ├── authController.js
│   ├── blogController.js
│   ├── bookingController.js
│   ├── cityController.js
│   ├── destinationController.js
│   ├── experienceController.js
│   ├── experienceImageController.js
│   ├── likeController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── bookingRoutes.js
│   ├── cityRoutes.js
│   ├── destinationRoutes.js
│   ├── experienceImageRoutes.js
│   ├── experienceRoutes.js
│   ├── likeRoutes.js
│   └── userRoutes.js
├── db.js
├── server.js
├── package.json
├── env.sample
├── .env
└── README.md
```

---

## 🔐 Authentication Routes

**Base URL:** `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |

---

## 👤 User Routes

**Base URL:** `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/providers/pending` | Get pending provider requests |
| PUT | `/providers/:id/approve` | Approve provider request |
| DELETE | `/providers/:id/reject` | Reject provider request |
| GET | `/` | Get all users |
| GET | `/:id` | Get user by ID |
| POST | `/` | Create new user |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

---

## 🌆 City Routes

**Base URL:** `/api/cities`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all cities |
| GET | `/:id` | Get city by ID |
| POST | `/` | Create city |
| PUT | `/:id` | Update city |
| DELETE | `/:id` | Delete city |

---

## 🏛 Destination Routes

**Base URL:** `/api/destinations`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all destinations |
| GET | `/:id` | Get destination by ID |
| POST | `/` | Create destination |
| PUT | `/:id` | Update destination |
| DELETE | `/:id` | Delete destination |

---

## 📝 Blog Routes

**Base URL:** `/api/blogs`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all blogs |
| GET | `/:id` | Get blog by ID |
| POST | `/` | Create blog |
| PUT | `/:id` | Update blog |
| DELETE | `/:id` | Delete blog |

---

## 🧳 Experience Routes

**Base URL:** `/api/experiences`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all experiences |
| GET | `/provider/my-experiences` | Get provider experiences |
| GET | `/:id` | Get experience by ID |
| POST | `/` | Create experience |
| PUT | `/:id` | Update experience |
| DELETE | `/:id` | Delete experience |
| PUT | `/admin/:id` | Admin update experience |
| DELETE | `/admin/:id` | Admin delete experience |
| PUT | `/:id/approve` | Approve experience |
| PUT | `/:id/reject` | Reject experience |

---

## 🖼 Experience Image Routes

**Base URL:** `/api/experience-images`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/experience/:experience_id` | Get images by experience |
| POST | `/` | Add experience image |
| PUT | `/:id` | Update experience image |
| DELETE | `/:id` | Delete experience image |

---

## 📅 Booking Routes

**Base URL:** `/api/bookings`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all bookings |
| GET | `/my-bookings` | Get current user's bookings |
| GET | `/:id` | Get booking by ID |
| POST | `/` | Create booking |
| PUT | `/:id` | Update booking |
| DELETE | `/:id` | Delete booking |

---

## ❤️ Like Routes

**Base URL:** `/api/likes`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/:user_id` | Get likes by user |
| POST | `/` | Like an experience |
| DELETE | `/:id` | Remove like |

---

## 👨‍💼 Admin Dashboard Route

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin-dashboard` | Protected admin dashboard route |

This route requires authentication and admin authorization.

---

## 🔒 Middleware

### authMiddleware.js

Verifies the user token before allowing access to protected routes.

### roleMiddleware.js

Controls access based on user role:

- Admin
- User
- Provider

---

## 🔄 Request Flow

```text
Client Request
      ↓
Express Route
      ↓
Controller
      ↓
PostgreSQL Database
      ↓
JSON Response
      ↓
React Frontend
```

---

## ✅ Main Backend Features

- User registration and login
- User logout
- Authentication using tokens
- Role-based access control
- CRUD operations for cities
- CRUD operations for destinations
- CRUD operations for blogs
- Experience submission and management
- Experience approval and rejection
- Provider request approval and rejection
- Booking management
- Like management
- Experience image management
- Protected admin dashboard
- PostgreSQL database connection
- Error handling