const socketIo = require("socket.io");
const NotificationService = require("./services/NotificationService");

let io;
// Initialize WebSocket server
function startSocketServer(server) {
  try {
    // Create Socket.IO instance and attach it to the provided server
    io = socketIo(server);

    // Handle new client connections
    io.on("connection", (socket) => {
      console.log("New client connected");

      // Handle client disconnections
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    // Handle WebSocket server errors
    io.on("error", (error) => {
      console.error("WebSocket server error:", error);
      // Handling specific types of errors here, such as unauthorized access or server crashes
    });

    return io;
  } catch (error) {
    console.error(
      "Error occurred during WebSocket server initialization:",
      error
    );
    // Handle the error appropriately, such as logging or exiting the process
    process.exit(1);
  }
}

function emitBidEvent({ itemId, userId, bidAmount }) {
  if (!io) {
    throw new Error("WebSocket server is not initialized");
  }
  const message = `A new bid has been placed on item ${itemId} by user ${userId} with a bid amount of ${bidAmount}.`;
  io.emit("bid_update", { itemId, userId, bidAmount, message });
}

module.exports = { startSocketServer, emitBidEvent };
