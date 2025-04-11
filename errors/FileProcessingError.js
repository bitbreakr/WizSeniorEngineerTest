class FileProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = FileProcessingError.name;
    this.code = 500;
  }
}

module.exports = FileProcessingError;
