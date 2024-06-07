"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

// Initialize Sequelize with DATABASE_URL if provided, else use config object
const sequelize = config.DATABASE_URL
  ? new Sequelize(config.DATABASE_URL, config)
  : new Sequelize(config);

// Load models dynamically from the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    // Exclude hidden files, the current file, and test files
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    // Load model from file
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
      Sequelize.Model
    );
    // Store model in db object
    db[model.name] = model;
  });

// Associate models if association method exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize instance and constructor to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export db object with Sequelize and models
module.exports = db;
