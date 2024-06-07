const { Item } = require("../models");
const { errorSymbol } = require("../utils/consoleSymbols");

const accessControlMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    // Check if the item exists
    if (!item) {
      console.log(`${errorSymbol} Item not found.`);
      return res.status(404).send({ error: "Item not found." });
    }

    // Check if the user is the owner or an admin
    if (req.user.id !== item.owner_id && req.user.role !== "admin") {
      // If user does not have permission to update or delete the item, return 403 error
      if (req.method === "PUT") {
        console.log(
          `${errorSymbol} User does not have permission to update this item.`
        );
        return res
          .status(403)
          .json({ error: "You do not have permission to update this item." });
      } else if (req.method === "DELETE") {
        console.log(
          `${errorSymbol} User does not have permission to delete this item.`
        );
        return res
          .status(403)
          .send({ error: "You do not have permission to delete this item." });
      }
    }

    // Attach the item to the request object for further processing
    req.item = item;
    next();
  } catch (error) {
    // Handle any unexpected errors
    console.error(`${errorSymbol} Access control error:`, error);
    res.status(500).send({ error: "Internal server error." });
  }
};

module.exports = accessControlMiddleware;
