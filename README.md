# 🎓 EventHub — College Event Management System

A full-stack web application for managing college events, built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

### 🔐 Authentication
- Admin and Student registration & login
- JWT-based authentication
- Password validation (min 8 chars, uppercase, lowercase, number, special character)

### 👨‍💼 Admin
- Create, edit, and delete events
- View only events they created
- View registered participants
- Download participant data as CSV
- Manage profile (name, phone, email, college, department)

### 🎒 Student
- View all events from all admins
- Search and filter events (by name, venue, college)
- Register/unregister for events
- View registered events
- Manage profile (name, email, college, course, year, semester)

### 📋 Event Details
- Full event information with admin contact details
- Real-time participant count
- Status badges (Open, Full, Expired)
- Direct contact links (email, phone)

### ⚡ Technical
- RESTful API design
- Centralized error handling
- Form validation (frontend + backend)
- Duplicate registration prevention
- Capacity and date validation
- Responsive design (mobile, tablet, desktop)
- Modern dark green UI theme

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally or a MongoDB Atlas connection URI

### 1. Clone / Navigate to the project

```bash
cd "Event Management System"
```

### 2. Setup Backend

```bash
cd server
npm install
```

Edit `.env` if needed (default connects to local MongoDB):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-events
JWT_SECRET=college_event_mgmt_secret_key_2024
```

Start the backend:
```bash
npm start
```

You should see:
```
✅ MongoDB connected
✅ Server running on port 5000
```

### 3. Setup Frontend

Open a **new terminal**:
```bash
cd client
npm install
npm run dev
```

The React app will start at `http://localhost:5173`

---

## 📁 Project Structure

```
Event Management System/
├── server/                     # Backend (Express + MongoDB)
│   ├── models/
│   │   ├── User.js            # User model (admin/student)
│   │   ├── Event.js           # Event model
│   │   └── Registration.js    # Registration model
│   ├── middleware/
│   │   ├── auth.js            # JWT auth & role middleware
│   │   └── errorHandler.js    # Centralized error handler
│   ├── routes/
│   │   ├── auth.js            # Auth routes (register, login, profile)
│   │   ├── events.js          # Event CRUD routes
│   │   └── registrations.js   # Registration & CSV export routes
│   ├── index.js               # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Responsive navigation
│   │   │   ├── EventCard.jsx  # Reusable event card
│   │   │   ├── Alert.jsx      # Alert notifications
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── MyRegistrations.jsx
│   │   │   ├── Participants.jsx
│   │   │   └── Profile.jsx
│   │   ├── api.js             # Axios instance with JWT
│   │   ├── App.jsx            # Router setup
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles & design system
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🎨 Color Palette

| Color          | Hex       | Usage                    |
|----------------|-----------|--------------------------|
| Light Green    | `#80EF80` | Accents, gradients       |
| Soft Yellow    | `#E3F0A3` | Highlights               |
| Muted Green    | `#BADBA2` | Borders, secondary text  |
| Dark Green     | `#42D674` | Primary actions, buttons |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login & get JWT    |
| GET    | `/api/auth/me`       | Get current user   |
| PUT    | `/api/auth/me`       | Update profile     |

### Events
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/events`       | Get events (role-based)  |
| GET    | `/api/events/:id`   | Get event details        |
| POST   | `/api/events`       | Create event (admin)     |
| PUT    | `/api/events/:id`   | Update event (admin)     |
| DELETE | `/api/events/:id`   | Delete event (admin)     |

### Registrations
| Method | Endpoint                                | Description                |
|--------|-----------------------------------------|----------------------------|
| POST   | `/api/registrations/:eventId`           | Register for event         |
| DELETE | `/api/registrations/:eventId`           | Cancel registration        |
| GET    | `/api/registrations/my`                 | Student's registrations    |
| GET    | `/api/registrations/event/:eventId`     | Event participants (admin) |
| GET    | `/api/registrations/event/:eventId/export` | Export CSV (admin)      |
