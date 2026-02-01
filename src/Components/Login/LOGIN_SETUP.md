# Login System Setup Guide

## Overview

A complete login authentication system has been implemented for your RA Admin React dashboard. The system includes:

- Login page at `/login`
- Protected routes (all dashboard pages require authentication)
- JWT token-based authentication
- Logout functionality
- Auth context for state management

## Features Implemented

### 1. **Login Component**

- Location: `src/Components/Login/Login.jsx`
- Beautiful gradient UI with email and password fields
- Real-time error handling and loading states
- Automatic redirect to dashboard on successful login

### 2. **API Service**

- Location: `src/Components/Login/loginAPI.js`
- Functions:
    - `loginUser(email, password)` - Authenticates user
    - `logoutUser()` - Clears tokens and user data
    - `getAuthToken()` - Retrieves stored JWT token
    - `getCurrentUser()` - Gets logged-in user data
    - `isAuthenticated()` - Checks if user is logged in

### 3. **Auth Context**

- Location: `src/Components/Login/AuthContext.jsx`
- Provides global authentication state
- Hook: `useAuth()` for accessing auth state in components
- Automatically checks for existing tokens on app load

### 4. **Protected Routes**

- Location: `src/Components/Login/ProtectedRoute.jsx`
- Wraps all dashboard routes
- Redirects unauthenticated users to `/login`
- Shows loader while checking authentication status

### 5. **Server Endpoints**

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (optional, client handles it)

### 6. **Header Integration**

- Logout button in header menu
- Displays current user's name and email
- One-click logout functionality

## How to Use

### Step 1: Create Test User

Run the seed script to create a test user:

```bash
cd server
node seed.js
```

**Test Credentials:**

```
Email: admin@example.com
Password: password123
```

### Step 2: Start Server and Frontend

**Terminal 1 - Start Backend Server:**

```bash
cd server
node server.js
```

The server will run on `http://localhost:5000`

**Terminal 2 - Start React App:**

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Step 3: Login

1. Visit `http://localhost:5173` or `http://localhost:5173/login`
2. Enter credentials:
    - Email: `admin@example.com`
    - Password: `password123`
3. You'll be redirected to the dashboard
4. Use the profile menu to logout

## File Structure

```
src/
├── Components/
│   └── Login/
│       ├── Login.jsx           # Main login page component
│       ├── login.css           # Login page styles
│       ├── loginAPI.js         # API service functions
│       ├── AuthContext.jsx     # Auth state management
│       └── ProtectedRoute.jsx  # Route protection wrapper
├── Route/
│   ├── index.jsx              # Updated with login route
│   └── AuthRoutes.jsx
└── Layout/
    └── Header/
        └── HeaderMenu.jsx     # Updated with logout functionality
```

## Adding More Users

### Via MongoDB Directly

Create documents in the `users` collection with this structure:

```javascript
{
  name: "User Name",
  email: "user@example.com",
  password: "hashedPassword", // Will be hashed by schema
  mobile: "1234567890",
  status: "Active"
}
```

### Via API (Add to your admin panel)

You can create an admin panel to add users using the existing User model.

## Authentication Flow

```
1. User visits /login
2. Enters email and password
3. Requests POST /api/auth/login
4. Server validates credentials and returns JWT token
5. Token stored in localStorage
6. User redirected to dashboard
7. Protected routes check for token before rendering
8. On logout, token is removed from localStorage
9. User redirected to /login
```

## Token Details

- **Token Type:** JWT (JSON Web Token)
- **Expiration:** 1 hour
- **Storage:** Browser's localStorage
- **Header:** `Authorization: Bearer <token>`

## Security Notes

1. **Token Storage:** Currently stored in localStorage. For enhanced security, consider:
    - Using httpOnly cookies (backend support needed)
    - Adding refresh token mechanism
2. **CORS:** Currently allows `http://localhost:5000`. Update in production.

3. **Password Storage:** Passwords are hashed using bcryptjs with salt rounds = 10

4. **JWT Secret:** Keep `JWT_SECRET` in `.env` file (never commit to git)

## Customization

### Change Login Redirect URL

In `src/Components/Login/Login.jsx`, line 28:

```javascript
navigate("/dashboard/ecommerce"); // Change this route
```

### Customize Login UI

Edit `src/Components/Login/login.css` for styling

### Modify Token Expiration

In `server/routes/authRoutes.js`, line 38:

```javascript
{
    expiresIn: "1h";
} // Change expiration time
```

### Change API URL

In `src/Components/Login/loginAPI.js`, line 1:

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Update as needed
```

## Troubleshooting

### Login page shows "Invalid Credentials"

- Verify test user exists: `node seed.js`
- Check MongoDB connection in server logs
- Ensure email and password match exactly

### Token issues / Redirect to login constantly

- Clear browser localStorage (DevTools > Application)
- Restart React app with `npm run dev`
- Check JWT_SECRET matches in .env

### Server errors

- Verify MongoDB URI is correct
- Check PORT is not already in use
- Ensure bcryptjs is installed: `npm install bcryptjs`

## Environment Variables Needed

Ensure your `.env` file has:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Next Steps

1. ✅ Test the login system with provided credentials
2. Add password reset functionality
3. Implement email verification
4. Add two-factor authentication
5. Create admin panel for user management
6. Implement role-based access control (RBAC)

---

**Created:** January 2026
**Status:** Ready for Production (with minor security enhancements)
