const { errorSymbol } = require('../utils/consoleSymbols');

const errorMiddleware = (err, req, res, next) => {
  // Log the error stack to the console
  console.error(`${errorSymbol} ${err.stack}`);
  
  // Send a generic error response with status code 500
  res.status(500).send({ error: 'Something went wrong!' });
};

module.exports = errorMiddleware;
