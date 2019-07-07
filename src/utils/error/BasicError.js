/**
 * @typedef {Object} BasicError.
 * @param {number} statusCode - HTTP statusCode desired to throw.
 * @param {String} message - Error message
 */
class BasicError extends Error {
  /**
   * Creates a basicError with statusCode.
   * @param {number} statusCode - HTTP statusCode desired to throw.
   * @param {String} message - Error message.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default BasicError;
