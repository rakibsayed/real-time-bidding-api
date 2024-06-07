const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { errorSymbol, successSymbol } = require('../utils/consoleSymbols');

// Controller function to register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Hash the password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user record
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Log successful registration
    console.log(`${successSymbol} User registered successfully:`, newUser.username);

    // Prepare response data
    const userData = newUser.get({ plain: true });
    delete userData.password; // Omit password from the response
    const userResponse = {
      message: "User registered successfully",
      user: userData,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    // Log registration error
    console.error(`${errorSymbol} Error registering user:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to authenticate a user and return a token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password"],
      plain: true,
    });

    if (!user) {
      // Log invalid login attempt
      console.log(`${errorSymbol} Invalid email or password for email:`, email);
      return res.status(400).send("Invalid email or password.");
    }

    // Check if the provided password matches the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Log invalid login attempt
      console.log(`${errorSymbol} Invalid email or password for email:`, email);
      return res.status(400).send("Invalid email or password.");
    }

    // Generate JWT token
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
    res.send({ token });

    // Log successful login
    console.log(`${successSymbol} User logged in successfully:`, user.username);
  } catch (error) {
    // Log login error
    console.error(`${errorSymbol} Error logging in:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// Controller function to get the profile of the logged-in user
exports.getProfile = async (req, res) => {
  try {
    // Find user profile by ID
    const userInstance = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role", "created_at"],
    });

    // Prepare user profile response
    const userResponse = userInstance.get({ plain: true });
    res.send(userResponse);

    // Log successful profile retrieval
    console.log(`${successSymbol} Profile retrieved successfully for user:`, userResponse.username);
  } catch (error) {
    // Log profile retrieval error
    console.error(`${errorSymbol} Error retrieving profile:`, error.message);
    res.status(400).json({ error: error.message });
  }
};
