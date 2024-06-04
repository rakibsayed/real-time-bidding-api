const { Item, User } = require("../models");

const bcrypt = require("bcryptjs");

// Helper function to create a mock item in the database
const createMockItem = async (ownerId) => {
  return await Item.create({
    name: "Test Item",
    description: "This is a test item",
    starting_price: 10,
    current_price: 10,
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    owner_id: ownerId || 1, // Assuming Item is owned by user Id 1
  });
};

// Helper function to create a mock item in the database
const createMockUser = async ({ username, email, password } = {}) => {
  const hashedPassword = await bcrypt.hash(password || "testpass1234", 10);
  return await User.create({
    username: username || "TestUser1",
    password: hashedPassword,
    email: email || "test@email.com",
  });
};

module.exports = {
  createMockItem,
  createMockUser,
};
