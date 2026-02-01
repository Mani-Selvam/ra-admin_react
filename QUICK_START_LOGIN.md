# RA Admin - Login System Quick Reference

## 🚀 Quick Start (5 Steps)

### 1. Create Test User

```bash
cd server
node seed.js
```

### 2. Start Backend

```bash
cd server
node server.js
# Output: Server running on port 5000
```

### 3. Start Frontend (New Terminal)

```bash
npm run dev
# Output: Local: http://localhost:5173
```

### 4. Go to Login Page

```
http://localhost:5173/login
```

### 5. Login with Test Credentials

- **Email:** `admin@example.com`
- **Password:** `password123`

---

## 📁 Key Files Created

| File                                      | Purpose              |
| ----------------------------------------- | -------------------- |
| `src/Components/Login/Login.jsx`          | Login page component |
| `src/Components/Login/login.css`          | Login page styles    |
| `src/Components/Login/loginAPI.js`        | API calls            |
| `src/Components/Login/AuthContext.jsx`    | State management     |
| `src/Components/Login/ProtectedRoute.jsx` | Route protection     |
| `server/seed.js`                          | Create test user     |

---

## 🔐 Authentication Features

✅ Login page with email/password  
✅ JWT token authentication  
✅ Protected dashboard routes  
✅ Automatic redirect to login when not authenticated  
✅ Logout from header menu  
✅ User info displayed in profile menu  
✅ Token stored securely in localStorage

---

## 🎨 Login Page UI

- **URL:** `/login`
- **Colors:** Purple gradient (#667eea → #764ba2)
- **Responsive:** Mobile, Tablet, Desktop
- **Features:**
    - Email validation
    - Password field with toggle
    - Error messages
    - Loading state during login
    - Forgot password link (ready for implementation)
    - Sign up link (ready for implementation)

---

## 🔗 API Endpoints

```
POST /api/auth/login
Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "status": "Active"
  }
}

Response (Error):
{
  "message": "Invalid Credentials"
}
```

---

## 🔑 Using Auth in Components

```javascript
import { useAuth } from "@/Components/Login/AuthContext";

function MyComponent() {
    const { user, isAuth, loading, logout } = useAuth();

    if (loading) return <Loader />;

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

---

## 📋 Protected Routes

All dashboard routes are protected:

```
✓ /dashboard/ecommerce
✓ /dashboard/project
✓ /dashboard/crypto
✓ /apps/calendar
✓ /apps/profile-page
✓ /master/user
... and all others
```

Unprotected routes:

```
✓ /login
✓ /admin-pages/auth_pages/*
✓ /error-pages/*
```

---

## 🛠️ Customization Examples

### Change Login Redirect

`src/Components/Login/Login.jsx:28`

```javascript
navigate("/dashboard/ecommerce"); // ← Change this
```

### Add More Test Users

Edit `server/seed.js` and add more users before `.save()`

### Change Token Expiration

`server/routes/authRoutes.js:38`

```javascript
{
    expiresIn: "24h";
} // ← Change expiration
```

### Modify Login UI

Edit `src/Components/Login/login.css`

---

## ⚠️ Common Issues & Solutions

| Issue                           | Solution                                         |
| ------------------------------- | ------------------------------------------------ |
| "Invalid Credentials" on login  | Run `node seed.js` to create test user           |
| Page keeps redirecting to login | Clear localStorage in DevTools                   |
| 404 API errors                  | Check if backend server is running on port 5000  |
| CORS errors                     | Verify CORS is enabled in `server/server.js`     |
| Password login fails            | Ensure password matches exactly (case-sensitive) |

---

## 📊 User State Management

### AuthContext provides:

- `user` - Current logged-in user object
- `isAuth` - Boolean: is user authenticated
- `loading` - Boolean: is auth check in progress
- `logout()` - Function to logout user

---

## 🔒 Security Features

✅ Passwords hashed with bcryptjs (10 salt rounds)  
✅ JWT tokens with 1-hour expiration  
✅ Token stored in localStorage  
✅ Protected routes with automatic redirect  
✅ User data validation on backend

---

## 📈 Production Checklist

- [ ] Change JWT_SECRET in `.env`
- [ ] Update MONGO_URI to production database
- [ ] Update API_BASE_URL for production domain
- [ ] Enable HTTPS in production
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Implement refresh tokens
- [ ] Add rate limiting to login endpoint
- [ ] Set up logging and monitoring

---

**Version:** 1.0  
**Created:** January 2026  
**Status:** ✅ Ready to Use
