class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = BadRequestError.name;
    this.code = 400;
  }
}

module.exports = BadRequestError;
