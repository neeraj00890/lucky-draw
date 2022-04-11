const { HTTP_STATUS } = require("../common-constants");

class ApplicationError extends Error {
    get name () {
      return this.constructor.name;
    }
  
    constructor (httpCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, path = "", message = "Something went wrong.") {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
      this.message = message;
      this.httpCode = httpCode;
      this.path = path;
      this.timestamp = new Date();
      Error.captureStackTrace(this);
    }
  }

  module.exports = ApplicationError;
  