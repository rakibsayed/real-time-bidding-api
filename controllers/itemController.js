const { Item } = require("../models");

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided
    const offset = (page - 1) * limit;

    // Validate page and limit parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Invalid page or limit parameters" });
    }

    const { count, rows } = await Item.findAndCountAll({
      limit: limit,
      offset: offset,
      raw: true,
    });
    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new item with optional image upload
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    const itemData = item.get({ plain: true });
    if (!item) return res.status(404).send({ error: "Item not found" });
    res.send(itemData);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Create a new item with optional image upload
exports.createItem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const item = await Item.create({
      name,
      description,
      starting_price,
      current_price: starting_price,
      end_time,
      image_url: imageUrl,
      owner_id: req.user.id,
    });
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update an existing item
exports.updateItem = async (req, res) => {
  
  try {
    const { item } = req;
    const { name, description, starting_price, current_price, end_time } =
      req.body;
    item.name = name || item.name;
    item.description = description || item.description;
    item.starting_price = starting_price || item.starting_price;
    item.current_price = current_price || item.current_price;
    item.end_time = end_time || item.end_time;
    // Set image_url only if req.file exists
    if (req.file) {
      item.image_url = req.file.path;
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const { item } = req;
    await item.destroy();
    res.send({ message: "Item deleted successfully." });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};
