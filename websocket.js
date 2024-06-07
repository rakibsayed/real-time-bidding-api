const socketIo = require("socket.io");
const { infoSymbol, errorSymbol } = require("./utils/consoleSymbols");

let io;

/**
 * Initializes the WebSocket server.
 * @param {Object} server - The HTTP server object.
 * @returns {Object} - The initialized Socket.IO instance.
 */
function startSocketServer(server) {
  try {
    // Create Socket.IO instance and attach it to the provided server
    io = socketIo(server);

    // Handle new client connections
    io.on("connection", (socket) => {
      console.log(infoSymbol, "New client connected");

      // Handle client disconnections
      socket.on("disconnect", () => {
        console.log(infoSymbol, "Client disconnected");
      });
    });

    // Handle WebSocket server errors
    io.on("error", (error) => {
      console.error(errorSymbol, "WebSocket server error:", error);
      // Handling specific types of errors here, such as unauthorized access or server crashes
    });

    return io;
  } catch (error) {
    console.error(
      errorSymbol,
      "Error occurred during WebSocket server initialization:",
      error
    );
    // Handle the error appropriately, such as logging or exiting the process
    process.exit(1);
  }
}

/**
 * Emits a bid event to all connected clients.
 * @param {Object} params - The parameters containing bid information.
 * @param {string} params.itemId - The ID of the item being bid on.
 * @param {string} params.userId - The ID of the user placing the bid.
 * @param {number} params.bidAmount - The amount of the bid.
 */
function emitBidEvent({ itemId, userId, bidAmount }) {
  if (!io) {
    throw new Error("WebSocket server is not initialized");
  }
  const message = `A new bid has been placed on item ${itemId} by user ${userId} with a bid amount of ${bidAmount}.`;
  io.emit("bid_update", { itemId, userId, bidAmount, message });
}

module.exports = { startSocketServer, emitBidEvent };
