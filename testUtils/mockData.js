const { Item, User } = require("../models");
const bcrypt = require("bcryptjs");
const { successSymbol, errorSymbol } = require("../utils/consoleSymbols");

// Helper function to create a mock item in the database
const createMockItem = async (ownerId) => {
  try {
    // Create a new item with default values
    const newItem = await Item.create({
      name: "Test Item",
      description: "This is a test item",
      starting_price: 10,
      current_price: 10,
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      owner_id: ownerId || 1, // Assuming Item is owned by user Id 1 if ownerId is not provided
    });
    console.log(`${successSymbol} Mock item created successfully.`);
    return newItem;
  } catch (error) {
    console.error(`${errorSymbol} Error creating mock item:`, error.message);
    throw error;
  }
};

// Helper function to create a mock user in the database
const createMockUser = async ({ username, email, password } = {}) => {
  try {
    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(password || "testpass1234", 10);
    // Create a new user with default values or provided values
    const newUser = await User.create({
      username: username || "TestUser1",
      password: hashedPassword,
      email: email || "test@email.com",
    });
    console.log(`${successSymbol} Mock user created successfully.`);
    return newUser;
  } catch (error) {
    console.error(`${errorSymbol} Error creating mock user:`, error.message);
    throw error;
  }
};

module.exports = {
  createMockItem,
  createMockUser,
};
