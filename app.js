const express = require("express");
const authRoutes = require("./routes/AuthRoutes");
const itemRoutes = require("./routes/ItemRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const errorHandler = require("./middleware/ErrorMiddleware");

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use("/users", authRoutes); // Route for user authentication
app.use("/items", itemRoutes); // Route for item management
app.use("/notifications", notificationRoutes); // Route for notifications

// Error Handling Middleware
app.use(errorHandler); // Middleware to handle errors

module.exports = app;
