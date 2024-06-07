const express = require("express"); // Importing express module
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController"); // Importing controller functions
const authMiddleware = require("../middleware/AuthMiddleware"); // Importing authentication middleware
const accessControlMiddleware = require("../middleware/AccessControlMiddleware"); // Importing access control middleware
const bidRoutes = require("./BidRoutes"); // Importing bid routes
const uploadImage = require("../middleware/UploadMiddleware"); // Importing upload middleware

const router = express.Router(); // Creating a new router instance

// Routes for managing items
router.get("/", getAllItems); // Route for getting all items
router.get("/:id", getItem); // Route for getting a specific item by ID
router.post("/", authMiddleware, uploadImage, createItem); // Route for creating a new item with authentication and upload middleware
router.put(
  "/:id",
  authMiddleware,
  accessControlMiddleware,
  uploadImage,
  updateItem
); // Route for updating an item with authentication, access control, and upload middleware
router.delete(
  "/:id",
  authMiddleware,
  accessControlMiddleware,
  deleteItem
); // Route for deleting an item with authentication and access control middleware

// Nested routes for managing bids related to an item
router.use(
  "/:itemId/bids",
  (req, res, next) => {
    // Middleware to extract itemId from params and attach it to the request object
    const { itemId } = req.params;
    req.itemId = itemId; // Attach itemId to the request object
    next(); // Call next middleware
  },
  bidRoutes // Include bidRoutes for managing bids
);

module.exports = router; // Exporting the router
