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
    "firstname": "John",       // Required, must be at least 3 characters long
    "lastname": "Doe"          // Optional, but if provided must be at least 3 characters long
  },
  "email": "user@example.com", // Required, must be a valid email format, at least 5 characters long
  "password": "secretpassword" // Required, must be at least 6 characters long
}
```

#### **Status Codes & Responses**

**`201 Created` - Successfully registered**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "user": {
    "_id": "64abcdef1234567890abcdef",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
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
