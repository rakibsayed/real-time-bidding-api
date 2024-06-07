const http = require("http");
const db = require("./models");
const app = require("./app");
const { startSocketServer } = require("./websocket");
const  chalk  = require("chalk"); // Import chalk for colored logs
require("dotenv").config();

const server = http.createServer(app);
startSocketServer(server);
const PORT = process.env.PORT || 3000;

// Connect to the Database and then Start the Server
db.sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () =>
      console.log(chalk.green(`Server running on port ${PORT}`))
    );
  })
  .catch((err) =>
    console.error(chalk.red("Unable to connect to the database:"), err)
  );
