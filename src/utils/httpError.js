// Create an Error that carries an HTTP status code.
// The error middleware in app.js uses err.status for the response.
// Example: throw httpError(404, 'Book not found');
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = httpError;
