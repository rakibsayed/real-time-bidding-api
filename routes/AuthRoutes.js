const express = require('express'); // Importing express module
const { register, login, getProfile } = require('../controllers/authController'); // Importing controller functions
const authMiddleware = require('../middleware/AuthMiddleware'); // Importing authentication middleware

const router = express.Router(); // Creating a new router instance

// Routes for user registration, login, and profile retrieval
router.post('/register', register); // Route for user registration
router.post('/login', login); // Route for user login
router.get('/profile', authMiddleware, getProfile); // Route for retrieving user profile

module.exports = router; // Exporting the router
