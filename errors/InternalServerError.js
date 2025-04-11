class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = InternalServerError.name;
    this.code = 500;
  }
}

module.exports = InternalServerError;
