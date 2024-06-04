const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Get only the data values
    const userData = newUser.get({ plain: true });
    // Exclude password from response
    delete userData.password;
    const userResponse = {
      message: "User registered successfully",
      user: userData,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Authenticate a user and return a token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password"], // Only include these fields
      plain: true, // Returns the first matching plain object instead of a Sequelize instance
    });

    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the profile of the logged-in user
exports.getProfile = async (req, res) => {
  try {
    const userInstance = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role", "created_at"], // Only include these fields
    });

    const userResponse = userInstance.get({ plain: true });
    res.send(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
