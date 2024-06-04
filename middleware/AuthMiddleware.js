const jwt = require("jsonwebtoken");
const User = require("../models").User; // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
  // Check if the "Authorization" header is present
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access denied. No token provided.");
  }
  
  // Extract the token from the header
  const token = authHeader.replace("Bearer ", "");
  
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database using the decoded user ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).send("Access denied. Invalid token.");
    }
    
    console.log("HEllllllll: ", user.id);
    // Attach the user information to the request object
    req.user = { id: user.id, username: user.username };

    // Call the next middleware
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = authMiddleware;
