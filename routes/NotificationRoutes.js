const express = require('express'); // Importing express module
const { getNotifications, markAsRead } = require('../controllers/notificationController'); // Importing controller functions
const authMiddleware = require('../middleware/AuthMiddleware'); // Importing authentication middleware

const router = express.Router(); // Creating a new router instance

// Routes for managing notifications
router.get('/', authMiddleware, getNotifications); // Route for getting notifications with authentication middleware
router.post('/mark-read', authMiddleware, markAsRead); // Route for marking notifications as read with authentication middleware

module.exports = router; // Exporting the router
