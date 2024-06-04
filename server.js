const http = require("http");
const db = require("./models");
const app = require("./app");
const { startSocketServer } = require("./websocket");
require("dotenv").config();

const server = http.createServer(app);
startSocketServer(server);
const PORT = process.env.PORT || 3000;

// Connect to the Database and then Start the Servre
db.sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
