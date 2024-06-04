const { Item } = require("../models");

const accessControlMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const item = await Item.findByPk(id);

  if (!item) return res.status(404).send({ error: "Item not found." });
  if (req.user.id !== item.owner_id && req.user.role !== "admin") {
    if (req.method === "PUT")
      return res
        .status(403)
        .json({ error: "You do not have permission to update this item." });
    else if (req.method === "DELETE")
      return res
        .status(403)
        .send({ error: "You do not have permission to delete this item." });
  }
  req.item = item;
  next();
};

module.exports = accessControlMiddleware;
