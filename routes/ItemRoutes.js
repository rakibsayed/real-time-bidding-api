const express = require("express");
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const authMiddleware = require("../middleware/AuthMiddleware");
const accessControlMiddleware = require("../middleware/AccessControlMiddleware");
const bidRoutes = require("./BidRoutes");
const uploadImage = require("../middleware/UploadMiddleware");

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", authMiddleware, uploadImage, createItem);
router.put(
  "/:id",
  authMiddleware,
  accessControlMiddleware,
  uploadImage,
  updateItem
);
router.delete("/:id", authMiddleware, accessControlMiddleware, deleteItem);
router.use(
  "/:itemId/bids",
  (req, res, next) => {
    // Extract itemId from params
    const { itemId } = req.params;
    // Attach itemId to the request object to pass it to the nested routes
    req.itemId = itemId;
    // Call next middleware
    next();
  },
  bidRoutes
);

module.exports = router;
