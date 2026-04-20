# Backend API Documentation

## Endpoints

### 1. Register User

**Endpoint:** `POST /users/register`

**Description:** 
Registers a new user in the system. Hashes the user's password, saves the user to the database, and returns a JWT authentication token along with the user details.

#### **Request Body (JSON)**

The endpoint expects a JSON payload with the following structure:

```json
{
  "fullname": {
    "firstname": "FIRSTNAME",       // Required, must be at least 3 characters long
    "lastname": "LASTNAME"          // Optional, but if provided must be at least 3 characters long
  },
  "email": "user@example.com", // Required, must be a valid email format, at least 5 characters long
  "password": "secretpassword" // Required, must be at least 6 characters long
}
```

#### **Status Codes & Responses**

**`201 Created` - Successfully registered**
```json
{
  "token": "Token",
  "user": {
    "_id": "ID",
    "fullname": {
      "firstname": "FIRSTNAME",
      "lastname": "LASTNAME"
    },
    "email": "user@example.com"
  }
}
```

**`400 Bad Request` - Validation Error**
Returned when the request body fails validation (e.g., missing required fields, invalid email, password too short).

```json
{
  "errors": [
    {
      "type": "field",
      "value": "usr",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**`500 Internal Server Error` - Server crash / Database issue**
Returned when an unexpected error occurs, such as a database connection failure or attempting to register with an email that already exists.

### 2. Login User

**Endpoint:** `POST /users/login`

**Description:** 
Authenticates a user using their email and password. Returns a JWT token upon successful login.

#### **Request Body (JSON)**

```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

#### **Status Codes & Responses**

**`200 OK` - Successfully logged in**
```json
{
  "token": "Token",
  "user": {
    "_id": "ID",
    "fullname": {
      "firstname": "FIRSTNAME",
      "lastname": "LASTNAME"
    },
    "email": "user@example.com"
  }
}
```

**`400 Bad Request` - Validation Error**
Returned when the email or password fails format validation.

**`401 Unauthorized` - Invalid credentials**
Returned when the email or password is incorrect.

### 3. Get User Profile

**Endpoint:** `GET /users/profile`

**Description:** 
Retrieves the profile of the currently authenticated user. Requires a valid JWT token.

#### **Headers**
- `Authorization: Bearer <your_jwt_token>`

#### **Status Codes & Responses**

**`200 OK` - Successfully retrieved profile**
```json
{
  "user": {
    "_id": "ID",
    "fullname": {
      "firstname": "FIRSTNAME",
      "lastname": "LASTNAME"
    },
    "email": "user@example.com"
  }
}
```

**`401 Unauthorized` - Missing or Invalid Token**
Returned when the token is missing, invalid, or the user is not found.

### 4. Logout User

**Endpoint:** `GET /users/logout`

**Description:** 
Logs out the currently authenticated user by blacklisting their JWT token.

#### **Headers**
- `Authorization: Bearer <your_jwt_token>`

#### **Status Codes & Responses**

**`200 OK` - Successfully logged out**
```json
{
  "message": "Logged out successfully"
}
```

**`401 Unauthorized` - Missing or Invalid Token**
Returned when the token is missing or invalid.

---

## Technical Details

### Authentication & Authorization (`auth.middleware.js`)
The API uses JWT (JSON Web Tokens) for authentication. Protected routes require the `Authorization` header with the Bearer scheme (`Bearer <token>`). The middleware verifies the token and attaches the authenticated user object to `req.user`.

### Data Models
- **`User` (`user.model.js`)**: Stores user details (fullname, email, password). Includes methods for hashing passwords (`hashPassword`), comparing passwords (`comparePassword`), and generating JWT tokens (`generateAuthToken`).
- **`BlacklistToken` (`blacklistToken.model.js`)**: Used to handle user logouts. When a user logs out, their current JWT token is stored in this collection to invalidate it. Documents in this collection automatically expire after 24 hours (matching the token validity) using a MongoDB TTL index.

### Services (`user.service.js`)
Handles the core business logic, such as creating a user in the database, breaking down operations from the controller layer. BASICALLY IT IS IMPLEMENTED TO MEET THE USER SERVICES AND NEEDS
###  JUST LIKE WE WANT O PLACE A SPECIAL DEMAND
