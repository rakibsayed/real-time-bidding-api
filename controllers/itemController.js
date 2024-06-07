const { Item } = require("../models");
const { errorSymbol, successSymbol } = require('../utils/consoleSymbols');

// Controller function to fetch all items with pagination support
exports.getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      console.log(`${errorSymbol} Invalid page or limit parameters`);
      return res.status(400).json({ error: "Invalid page or limit parameters" });
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
    console.log(`${successSymbol} Fetched all items successfully.`);
  } catch (error) {
    console.error(`${errorSymbol} Error fetching items:`, error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to fetch a single item by ID
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      console.log(`${errorSymbol} Item not found`);
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
    console.log(`${successSymbol} Fetched item successfully.`);
  } catch (error) {
    console.error(`${errorSymbol} Error fetching item:`, error);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to create a new item
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
    console.log(`${successSymbol} Item created successfully.`);
    res.status(201).json(item);
  } catch (error) {
    console.error(`${errorSymbol} Error creating item:`, error);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to update an existing item
exports.updateItem = async (req, res) => {
  try {
    const { item } = req;
    const { name, description, starting_price, current_price, end_time } = req.body;

    item.name = name || item.name;
    item.description = description || item.description;
    item.starting_price = starting_price || item.starting_price;
    item.current_price = current_price || item.current_price;
    item.end_time = end_time || item.end_time;

    if (req.file) {
      item.image_url = req.file.path;
    }

    await item.save();
    console.log(`${successSymbol} Item updated successfully.`);
    res.status(200).json(item);
  } catch (error) {
    console.error(`${errorSymbol} Error updating item:`, error);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const { item } = req;
    await item.destroy();
    console.log(`${successSymbol} Item deleted successfully.`);
    res.json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error(`${errorSymbol} Error deleting item:`, error);
    res.status(400).json({ error: error.message });
  }
};
