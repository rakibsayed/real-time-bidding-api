# Real-Time-Bidding Platform

## Introduction

This project is a comprehensive RESTful API for a real-time bidding platform built using Node.js, Express, Socket.io, and a SQL database. It supports advanced CRUD operations, user authentication, role-based access control, real-time bidding, and notifications.

## Setup

1. Install Node.js (https://nodejs.org/)

2. Clone the repository: `git clone https://github.com/rakibsayed/real-time-bidding-api.git`

3. Install dependencies:

   ```sh
   cd real-time-bidding
   npm install
   ```

4. Set up environment variables

   ```sh
   cp .env.example .env <!--  Edit .env file with appropriate values -->
   ```

## Database Setup

1. Install PostgreSQL or MySQL.
2. Create a new database for the project.
3. Update the `.env` file with the database connection details.

## Running the Project

```sh
npm start
```

## Running Tests

```sh
npm test
```

## API Endpoints

### Users

#### POST /users/register

**Description:** Register a new user.

**Request Body:**

```json
{
  "username": "example_user",
  "password": "password123",
  "email": "user@example.com"
}
```

**Response:**

- **Success:**

  - **Status Code:** 201 (Created)
  - **Body:**
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
    ```

- **Error:**

  - **Status Code:** 400 (Bad Request)
  - **Body:**

  ```json
  {
    "error": "Username or Email already exists"
  }
  ```

#### POST /users/login

**Description:** Login User.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**

  ```json
  {
    "token": "<JWT Token>"
  }
  ```

- **Error:**
  - **Status Code:** 400 (Bad Request)
  - **Body:**
  ```json
  {
    "error": "Invalid email or password."
  }
  ```

#### GET /users/profile

**Description:** Get the profile of the logged-in user.

**Authorization:** Bearer token in the Authorization header.

**Response:**

- **Success:**
  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    {
      "id": 1,
      "username": "example_user",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-06-06T12:00:00Z"
    }
    ```
- **Error:**
  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```

### Items

#### GET /items

**Description:** Retrieve all auction items (with pagination).

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**

  ```json
  {
    "totalItems": "Total No. of Items",
    "totalPages": "Total No. of Pages",
    "currentPage": "Current Page No",
    "items": [
      {
        "id": 1,
        "name": "Item Name",
        "description": "Item Description",
        "starting_price": 100.0,
        "current_price": 150.0,
        "image_url": "http://example.com/image.jpg",
        "end_time": "2024-06-06T12:00:00Z",
        "created_at": "2024-06-01T12:00:00Z",
        "owner_id": 1
      }
      //...
    ]
  }
  ```

- **Error:**
  - **Status Code:** 400 (Bad Request)
  - **Body:**
    ```json
    {
      "error": "Invalid page or limit parameters"
    }
    ```

#### GET /items/:id

**Description:** Retrieve a single auction item by ID.

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    {
      "id": 1,
      "name": "Item Name",
      "description": "Item Description",
      "starting_price": 100.0,
      "current_price": 150.0,
      "image_url": "http://example.com/image.jpg",
      "end_time": "2024-06-06T12:00:00Z",
      "created_at": "2024-06-01T12:00:00Z",
      "owner_id": 1
    }
    ```

- **Error:**
  - **Status Code:** 404 (Not Found)
  - **Body:**
    ```json
    {
      "error": "Item not found."
    }
    ```

#### POST /items

**Description:** Create a new auction item. (Authenticated users, image upload)

**Authorization:** Bearer token in the Authorization header.

**Request Body:**

```json
{
  "name": "New Item",
  "description": "New Item Description",
  "starting_price": 100.0,
  "image_url": "http://example.com/new-image.jpg",
  "end_time": "2024-06-10T12:00:00Z"
}
```

**Response:**

- **Success:**

  - **Status Code:** 201 (Created)
  - **Body:**
    ```json
    {
      "id": 2,
      "name": "New Item",
      "description": "New Item Description",
      "starting_price": 100.0,
      "current_price": 100.0,
      "image_url": "http://example.com/new-image.jpg",
      "end_time": "2024-06-10T12:00:00Z",
      "created_at": "2024-06-02T12:00:00Z",
      "owner_id": 1
    }
    ```

- **Error:**
  - **Status Code:** 400 (Bad Request)
  - **Body:**
    ```json
    {
      "error": "Invalid input data"
    }
    ```

#### PUT /items/:itemId

**Description:** Create a new auction item. (Authenticated users, Access Control ,image upload)

**Authorization:** Bearer token in the Authorization header.

**Request Body:**

```json
{
  "name": "New Item",
  "description": "New Item Description",
  "starting_price": 100.0,
  "image_url": "http://example.com/new-image.jpg",
  "end_time": "2024-06-10T12:00:00Z"
}
```

**Response:**

- **Success:**

  - **Status Code:** 201 (Created)
  - **Body:**
    ```json
    {
      "id": 2,
      "name": "New Item",
      "description": "New Item Description",
      "starting_price": 100.0,
      "current_price": 100.0,
      "image_url": "http://example.com/new-image.jpg",
      "end_time": "2024-06-10T12:00:00Z",
      "created_at": "2024-06-02T12:00:00Z",
      "owner_id": 1
    }
    ```

- **Error:**

  - **Status Code:** 404 (Not Found)
  - **Body:**

    ```json
    {
      "error": "Item not found."
    }
    ```

  - **Status Code:** 403 (Not Found)
  - **Body:**

    ```json
    {
      "error": "You do not have permission to update this item."
    }
    ```

  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```

#### DELETE /items/:itemId

**Description:** Create a new auction item. (Authenticated users, Access Control ,image upload)

**Authorization:** Bearer token in the Authorization header.

**Request Body:**

```json
{
  "name": "New Item",
  "description": "New Item Description",
  "starting_price": 100.0,
  "image_url": "http://example.com/new-image.jpg",
  "end_time": "2024-06-10T12:00:00Z"
}
```

**Response:**

- **Success:**

  - **Status Code:** 200 (Ok)
  - **Body:**
    ```json
    {
      "message": "Item deleted successfully."
    }
    ```

- **Error:**

  - **Status Code:** 404 (Not Found)
  - **Body:**

    ```json
    {
      "error": "Item not found."
    }
    ```

  - **Status Code:** 403 (Not Found)
  - **Body:**

    ```json
    {
      "error": "You do not have permission to delete this item."
    }
    ```

  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```

### Bids

#### GET /items/:itemId/bids

**Description:** Retrieve all bids for a specific item.

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "item_id": 1,
        "bidder_id": 1,
        "bid_amount": 150.0,
        "created_at": "2024-06-02T12:00:00Z"
      }
      //...
    ]
    ```

- **Error:**
  - **Status Code:** 404 (Not Found)
  - **Body:**
    ```json
    {
      "error": "Item not found."
    }
    ```

#### POST /items/:itemId/bids

**Description:** Place a new bid on a specific item. (Authenticated users)

**Request Body:**

```json
{
  "bid_amount": 200.0
}
```

**Response:**

- **Success:**

  - **Status Code:** 201 (Created)
  - **Body:**
    ```json
    {
      "id": 2,
      "item_id": 1,
      "user_id": 1,
      "bid_amount": 200.0,
      "created_at": "2024-06-02T12:30:00Z"
    }
    ```

- **Error:**
  - **Status Code:** 404 (Not Found)
  - **Body:**
    ```json
    {
      "error": "Item not found."
    }
    ```
  - **Status Code:** 400 (Bad Request)
  - **Body:**
    ```json
    {
      "error": "Bid amount must be higher than the current price."
    }
    ```
  - **Status Code:** 403 (Forbidden)
  - **Body:**
    ```json
    {
      "error": "Owner cannot bid on their own item."
    }
    ```
  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```

### Notifications

#### GET /notifictaions

**Description:** Retrieve notifications for the logged-in user.

**Authorization:** Bearer token in the Authorization header.

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**
    ```json
    [
      {
        "id": 1,
        "user_id": 1,
        "message": "You have been outbid on 'Item Name'.",
        "is_read": false,
        "created_at": "2024-06-02T12:45:00Z"
      }
      //...
    ]
    ```

- **Error:**
  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```

#### POST /notifications/mark-read

**Description:** Mark notifications as read.

**Authorization:** Bearer token in the Authorization header.

**Request Body:**

```json
{
  "notification_id": 1
}
```

OR

```json
{
  "notification_ids": [1, 2, 3]
}
```

**Response:**

- **Success:**

  - **Status Code:** 200 (OK)
  - **Body:**

  ```json
  {
    "message": "3 notification(s) marked as read"
  }
  ```

- **Error:**

  - **Status Code:** 401 (Unauthorized)
  - **Body:**
    ```json
    {
      "error": "Access Denied."
    }
    ```
  - **Status Code:** 400 (Bad Request)
  - **Body:**

    ```json
    {
      "error": "Invalid notification IDs."
    }
    ```

    OR

    ```json
    {
      "error": "No notification IDs provided."
    }
    ```

  - **Status Code:** 400 (Bad Request)
  - **Body:**
    ```json
    {
      "error": "No unread notifications found with the provided IDs."
    }
    ```

## Socket.io Client Setup

**Connect to the Real-Time API Bidding server using the Socket.IO client library.**
```javascript
// Import the socket.io-client library
const io = require("socket.io-client");

// Specify the URL of the server
const serverUrl = "http://your-server-hostname:your-server-port";

// Connect to the server
const socket = io(serverUrl);

// Notify when the connection is established
socket.on("connect", () => {
  console.log("Connected to the Real-Time API Bidding server.");
});

// Listen for bid update events
socket.on("bid_update", (data) => {
  console.log("Received bid update:", data);
  // Handle the bid update here
});
```
