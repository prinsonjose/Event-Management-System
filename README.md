# 🎓 EventHub — College Event Management System

A full-stack web application for managing college events, built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

### 🔐 Authentication
- Admin and Student registration & login
- JWT-based authentication
- Password validation (min 8 chars, uppercase, lowercase, number, special character)
- **New**: Mandatory field validation and **strict 10-digit phone number validation**.

### 👨‍💼 Admin
- Create, edit, and delete events
- **New**: Added "Location" field to specify room numbers or venue details.
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
- Full event information including **Location** and admin contact details
- Real-time participant count
- Status badges (Open, Full, Expired)
- Direct contact links (email, phone)

### ⚡ Technical
- RESTful API design
- Centralized error handling
- Form validation (frontend + backend)
- **New**: Enhanced mobile responsiveness with a solid-colored navigation menu.
- Duplicate registration prevention
- Capacity and date validation
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

Edit `.env` if needed:
```
PORT=5000
MONGO_URI=
JWT_SECRET=c
```

Start the backend:
```bash
npm start
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

## 📁 Detailed File Descriptions

### 🖥️ Backend (`/server`)
- **`index.js`**: The main entry point. It initializes the Express application, connects to MongoDB using Mongoose, sets up middleware (CORS, JSON parsing), and defines the base API routes.
- **`models/User.js`**: Defines the User schema with roles (Admin/Student). It handles password hashing using bcrypt and enforces the **10-digit numeric phone validation**.
- **`models/Event.js`**: The schema for events. It stores all event details including name, date, venue, and the newly added **location** field. It also uses virtuals to track registration counts.
- **`models/Registration.js`**: A join-model that links Students to the Events they have registered for, preventing duplicate entries.
- **`routes/auth.js`**: Handles user lifecycle operations like registration, login with JWT token generation, and secure profile management.
- **`routes/events.js`**: Handles the core logic for event management. Includes validation for the **location** field and checks for admin ownership before allowing edits/deletions.
- **`middleware/auth.js`**: Contains security logic. It verifies JWT tokens on incoming requests and ensures users have the correct permissions (Admin vs Student) to access specific routes.
- **`middleware/errorHandler.js`**: Centralizes error management. It catches database errors, validation failures, and server crashes, returning clean JSON responses to the frontend.

### 🎨 Frontend (`/client`)
- **`App.jsx`**: The main router. It controls the application's flow, defining public routes (Login/Register) and protected routes that require authentication.
- **`api.js`**: A pre-configured Axios instance. It handles communication with the backend and automatically attaches the current user's JWT token to the headers of every request.
- **`context/AuthContext.jsx`**: Manages the global authentication state. It tracks whether a user is logged in, their role, and handles the persistence of the session.
- **`components/Navbar.jsx` & `Navbar.css`**: The responsive top navigation. It has been specifically optimized for mobile devices with a solid background and smooth transitions.
- **`pages/Register.jsx`**: A comprehensive registration form. It enforces mandatory fields and validates that phone numbers are exactly 10 digits before allowing submission.
- **`pages/EventForm.jsx`**: The dashboard for admins to create or update events. It now includes a dedicated field for **Event Location**.
- **`pages/EventDetails.jsx`**: The primary view for seeing all information about an event, including the venue, location, and the admin's contact info.
- **`index.css`**: The design system for the app. It defines the color palette, typography, and global layout rules (like the responsive `form-row` utility).

---

## 🔄 Project Workflow

### 1. Registration & Authentication
- **Choose Role**: Users register as either a **Student** or an **Admin**.
- **Validation**: All fields are mandatory. Phone numbers must be exactly 10 digits. Passwords must meet security requirements.
- **Login**: Upon successful registration, users are redirected to the login page to enter their credentials.

### 2. Admin Workflow: Hosting Events
- **Dashboard**: Admins see stats of their events (total events, active, total registrations).
- **Create Event**: Admins fill details including "Location" (e.g., Room No, Google Map link).
- **Manage**: Admins can edit or delete their events.
- **Participants**: Admins can view a list of students registered for their events and export them to a CSV file.

### 3. Student Workflow: Attending Events
- **Discover**: Students see a live feed of all upcoming events.
- **Search**: Students can filter events by name or college to find what interests them.
- **Register**: Students can register for events if there is space. They can also cancel their registration if needed.
- **Track**: Students can view all events they've registered for in a dedicated "My Registrations" view.

---

## 🛠️ Testing & Error Handling

### 🟢 API Testing
The backend API is robust and handles errors gracefully:
- **Validation Errors**: Trying to register with an 8-digit phone number will return a `400 Bad Request` with a clear error message.
- **Authorization Errors**: Students trying to access `/api/events` with a POST request will receive a `403 Forbidden` response.

### 🟡 UI Verification
- **Mobile Menu**: Open the navigation on a phone view. The menu should be **solid (not transparent)** and start perfectly from the top.
- **Form Validation**: Fields will turn red or show alerts if mandatory data is missing during registration.

### 🔴 Data Integrity
- **Location Support**: Every event created now strictly saves and displays its specific location along with the venue name.
