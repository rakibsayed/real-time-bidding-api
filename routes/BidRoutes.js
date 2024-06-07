const express = require('express'); // Importing express module
const { getAllBids, placeBid } = require('../controllers/bidController'); // Importing controller functions
const authMiddleware = require('../middleware/AuthMiddleware'); // Importing authentication middleware

const router = express.Router(); // Creating a new router instance

// Routes for getting all bids and placing a bid
router.get('/', getAllBids); // Route for getting all bids
router.post('/', authMiddleware, placeBid); // Route for placing a bid, with authentication middleware

module.exports = router; // Exporting the router
