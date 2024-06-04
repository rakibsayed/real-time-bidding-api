"use strict";

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    // Function to hash password
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(password, salt);
    };

    // Create users
    const usersData = [
      {
        username: "john_doe",
        email: "john@example.com",
        password: await hashPassword("password123"),
        role: "user",
        created_at: "2024-05-30T12:00:00Z",
      },
      {
        username: "jane_doe",
        email: "jane@example.com",
        password: await hashPassword("password456"),
        role: "admin",
        created_at: "2024-05-30T12:00:00Z",
      },
      {
        username: "alice_smith",
        email: "alice@example.com",
        password: await hashPassword("password789"),
        role: "admin",
        created_at: "2024-05-30T12:00:00Z",
      },
      {
        username: "bob_johnson",
        email: "bob@example.com",
        password: await hashPassword("passwordabc"),
        role: "user",
        created_at: "2024-05-30T12:00:00Z",
      },
      {
        username: "emma_watson",
        email: "emma@example.com",
        password: await hashPassword("passwordxyz"),
        role: "user",
        created_at: "2024-05-30T12:00:00Z",
      },
    ];

    await queryInterface.bulkInsert("Users", usersData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all users
    await queryInterface.bulkDelete("Users", null, {});
  },
};
