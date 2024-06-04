const express = require('express');
const { getAllBids, placeBid } = require('../controllers/bidController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = express.Router();

router.get('/', getAllBids);
router.post('/', authMiddleware, placeBid);

module.exports = router;
