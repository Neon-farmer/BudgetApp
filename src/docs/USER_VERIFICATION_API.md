# User Verification API Endpoints

This document outlines the API endpoints that need to be implemented on your backend to support user verification.

## Required Endpoints

### 1. User Verification Endpoint
**Endpoint:** `GET /user/verify`  
**Authentication:** Required (Bearer token)  
**Description:** Verifies if the authenticated user exists in the database and is authorized to use the application.

**Response Format:**
```json
{
  "user": {
    "id": "string",
    "email": "string", 
    "name": "string",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLoginAt": "2025-01-01T00:00:00Z"
  },
  "isAuthorized": true,
  "budget": {
    // Include budget data if user exists and is authorized
  }
}
```

**Error Responses:**
- `404 Not Found`: User not found in database
- `403 Forbidden`: User exists but account is inactive
- `401 Unauthorized`: Invalid or missing authentication token

### 2. User Profile Endpoint (Optional)
**Endpoint:** `GET /user/profile`  
**Authentication:** Required (Bearer token)  
**Description:** Gets the current user's profile information.

**Response Format:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string", 
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "lastLoginAt": "2025-01-01T00:00:00Z"
}
```

### 3. User Creation Endpoint (Optional)
**Endpoint:** `POST /user/create`  
**Authentication:** Required (Bearer token)  
**Description:** Creates a new user account (if auto-registration is enabled).

**Response Format:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## Implementation Notes

1. **User Identification**: Use the email or object ID from the JWT token to identify users
2. **Database Schema**: Ensure your user table has the required fields (id, email, name, isActive, createdAt, lastLoginAt)
3. **Authorization Logic**: Implement business rules for who can access the application
4. **Audit Trail**: Consider logging login attempts and user verification requests
5. **Error Handling**: Return appropriate HTTP status codes and error messages

## Frontend Flow

1. User authenticates with Microsoft Azure AD
2. Frontend receives JWT token
3. Frontend calls `/user/verify` endpoint with Bearer token
4. If user exists and is active → Allow access to application
5. If user not found → Show "User not found" message
6. If user inactive → Show "Account deactivated" message
7. If verification fails → Show error and allow retry

## Security Considerations

- Always validate JWT tokens on the backend
- Implement rate limiting on verification endpoints
- Log suspicious activity (repeated verification failures)
- Consider implementing user session management
- Ensure CORS is properly configured for your frontend domain
