# Full-Stack Application - To-Do Management

This is a To-Do application built using Express.js for the backend and plain HTML, CSS, and JavaScript for the frontend.

## Technology Choices

### Backend

- **Express.js (Node.js)**: Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is easy to set up and has a large ecosystem of middleware to extend its functionality.

- **MongoDB (NoSQL)**: MongoDB is chosen for its scalability and flexibility in handling a variety of data structures. It allows for quick development iterations and provides a schema-less approach to data storage.

### Frontend

- **HTML**: For creating the structure of web pages.
- **CSS**: For styling the web pages.
- **JavaScript**: For adding interactivity to the web pages.
- **Fetch API**: Fetch API is modern and provides a more powerful and flexible feature set than the older XMLHttpRequest (AJAX). It uses Promises, which makes it easier to work with asynchronous requests and handle responses.

## Setup Guide

### Prerequisites

- Node.js installed on your local machine.
- MongoDB installed and running.

### Installation and Running

1. **Clone the repository:**
```bash
git clone <repository_url>
cd notes-app
```

2. **Install depedencies:**
```bash
npm install
```

3. **Install depedencies:**
```
PORT=3300
ATLAS_URI=<your_mongodb_uri>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
```

4. **Start the server:**
```bash
npm start
```

5.  **Access the application:**
   Open your browser and navigate to http://localhost:3300.

## Usage Guide

### Running the Server

To run the server, use the following command:
```bash
npm start
```
The server will start on the port specified in the .env file (default is 3300).

### Accessing the Frontend

- Navigate to http://localhost:3300 to access the To-Do application.
- The frontend files are located in the views folder, with their associated CSS and JavaScript files located in the public folder.

## API Endpoints

### Auth Routes
- **POST /auth/signup**
  - **Request Body**: 
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - **Response**:
    - `201 Created`: User registered.
    - `400 Bad Request`: Invalid user data received.
    - `409 Conflict`: Username or email already exist.
    
- **POST /auth/login**
  - **Request Body**: 
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:
    - `200 OK`: Login success.
    - `401 Unauthorized`: Unauthorized.
    - `500 Internal Server Error`: Server configuration error.

### To-Do Routes
- **GET /todo**
  - **Response**:
    - `200 OK`: Returns an array of to-do items.
    - `400 Bad Request`: No todos found.

- **POST /todo**
  - **Request Body**: 
    ```json
    {
      "user_id": "string",
      "task": "string",
      "priority": "string",
      "completed": "boolean"
    }
    ```
  - **Response**:
    - `201 Created`: New todo created.
    - `400 Bad Request`: Invalid todo data received.
    - `409 Conflict`: Duplicate todo task.

- **PUT /todo/:id**
  - **Request Params**: 
    - `id`: The ID of the to-do item.
  - **Request Body**: 
    ```json
    {
      "task": "string",
      "priority": "string",
      "completed": "boolean"
    }
    ```
  - **Response**:
    - `201 Created`: New todo created.
    - `400 Bad Request`: Invalid todo data received.
    - `409 Conflict`: Duplicate todo task.

- **DELETE /todo/:id**
  - **Request Params**: 
    - `id`: The ID of the to-do item.
  - **Response**:
    - `200 Created`: Todo deleted.
    - `400 Bad Request`: Todo not found.

## Logging

- **Logs** are stored in the `logs` directory.
  - **`errLog.log`**: Stores general error logs.
  - **`mongoErrLog.log`**: Stores MongoDB related error logs.
  - **`reqLog.log`**: Stores erquest logs.

## User Authentication and Session Management

- **Password Security**: Passwords are hashed using bcrypt before being stored in the database to ensure security.
- **Session Management**: JWT tokens are used for session management to keep users logged in across multiple requests.

## Frontend Communication with Backend
- **Fetch API**: The Fetch API is used for communication between the frontend and backend. It provides a modern and flexible approach to making HTTP requests and handling responses, using Promises for easier asynchronous programming.

## User Interface

- **Signup Form**: An HTML form for user signup with fields for username, email, and password.
- **Login Form**: An HTML form for user login with fields for email and password.
- **CRUD Table**: An HTML table to display data entries, visible only when the user is logged in. Includes buttons/forms for creating, updating, and deleting data entries.

## Conditional Display

- If the user is not logged in, only the login/signup form is displayed
- After a successful login, the CRUD table and a logout button are displayed and can be accessed.