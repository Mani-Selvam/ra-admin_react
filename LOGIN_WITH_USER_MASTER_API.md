# Login with User Master API Integration

## Overview

Your login system can now authenticate using the **User Master API** which includes company and designation data. This is useful if you want to:

- Get company information along with user login
- Get designation information along with user login
- Use the same validation as the User Master module
- Maintain consistency with your user management system

## Two Login Endpoints Available

### 1. Standard Login (Simple)

```
POST /api/auth/login
```

- Returns: Basic user data (id, name, email, status)
- Use: When you only need basic user info

### 2. Login with User Master API (Enhanced)

```
POST /api/auth/login/master
```

- Returns: User data + populated company and designation info
- Use: When you need complete user profile with company/designation details

## How to Use

### Option A: Use Standard Login (Current)

Already working - no changes needed:

```javascript
import { loginUser } from "@/Components/Login/loginAPI";

const response = await loginUser(email, password);
// Returns: { token, user: { id, name, email, status } }
```

### Option B: Use User Master API Login (New)

Switch to the enhanced version:

```javascript
import { loginUserWithMaster } from "@/Components/Login/loginAPI";

const response = await loginUserWithMaster(email, password);
// Returns: { token, user: { id, name, email, mobile, status, company, designation } }
```

## Example Response Comparison

### Standard Login Response:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com",
        "companyId": "company_id",
        "designationId": "designation_id",
        "status": "Active"
    }
}
```

### User Master API Login Response:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com",
        "mobile": "1234567890",
        "companyId": "company_id",
        "designationId": "designation_id",
        "status": "Active",
        "company": "Company Name",
        "designation": "Designation Name"
    }
}
```

## How to Switch Your Login Component

Edit `src/Components/Login/Login.jsx`:

**Current code (line 19):**

```javascript
const response = await loginUser(email, password);
```

**Change to:**

```javascript
const response = await loginUserWithMaster(email, password);
```

**And update the import (line 3):**

```javascript
import { loginUserWithMaster } from "@/Components/Login/loginAPI";
```

## Why Use User Master API Login?

✅ **Complete User Profile** - Get company and designation names directly  
✅ **Consistency** - Uses the same User Master validation  
✅ **Additional Data** - Includes mobile, company name, designation name  
✅ **Single Source** - Maintains data consistency with User Master module  
✅ **Better User Experience** - Can display full user profile immediately after login

## Example: Using Master API Data in Dashboard

After login with Master API, you can access:

```javascript
const { user } = useAuth();

// Display full user info
<h2>{user.name}</h2>
<p>Email: {user.email}</p>
<p>Company: {user.company}</p>
<p>Designation: {user.designation}</p>
<p>Mobile: {user.mobile}</p>
```

## Database Requirements

Make sure your User collection has:

- ✅ email (string, required)
- ✅ password (string, hashed)
- ✅ name (string)
- ✅ mobile (string)
- ✅ status (string)
- ✅ companyId (reference to Company collection)
- ✅ designationId (reference to Designation collection)

## Testing Both Endpoints

### Test Standard Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Test User Master API Login:

```bash
curl -X POST http://localhost:5000/api/auth/login/master \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## Which One Should You Use?

| Use Case                           | Endpoint                 |
| ---------------------------------- | ------------------------ |
| Simple authentication only         | `/api/auth/login`        |
| Need company/designation info      | `/api/auth/login/master` |
| Show full user profile immediately | `/api/auth/login/master` |
| Minimal data transfer needed       | `/api/auth/login`        |
| Match User Master module           | `/api/auth/login/master` |

## Summary

Both endpoints work perfectly! Choose based on your needs:

- **Standard** if you only need basic authentication
- **Master API** if you want complete user profile data

Both use the same User collection and password validation. The Master API version just populates the company and designation references.

---

**Your login system now supports both methods!** 🎉
