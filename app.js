const express = require("express");
const authRoutes = require("./routes/AuthRoutes");
const itemRoutes = require("./routes/ItemRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const errorHandler = require("./middleware/ErrorMiddleware");

const app = express();

// Middlewares to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use("/users", authRoutes);
app.use("/items", itemRoutes);
app.use("/notifications", notificationRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
