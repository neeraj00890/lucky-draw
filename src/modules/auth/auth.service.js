const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HTTP_STATUS, EMPTY_STRING } = require("../common/common-constants");
const ApplicationError = require("../common/classes/application-error");
const responseMessages = require("../common/response-messages");

function verifyToken(token) {
    try {
        const payload = jwt.verify(token, process.env.SECRET)
        return payload ? true: false;
    } catch (error) {
        throw new ApplicationError(HTTP_STATUS.NOT_AUTHORIZED, EMPTY_STRING, error.message);
    }
}

exports.getToken = async function (args) {
    const { username, password } = args;
    if(username === process.env.USER_NAME && bcrypt.compareSync(password, process.env.USER_PASS)) {
      return jwt.sign({username}, process.env.SECRET, {
          expiresIn: "1d"
      })
    } else {
        throw new ApplicationError(HTTP_STATUS.NOT_AUTHORIZED, EMPTY_STRING, responseMessages.WRONG_CREDS);
    }
  };

exports.verifyTokenMiddleware = function(req, res, next) {
    const token = req.headers["authorization"]?.substring(7);
    if(token && verifyToken(token)) return next();
    else throw new ApplicationError(HTTP_STATUS.NOT_AUTHORIZED, EMPTY_STRING, responseMessages.NOT_AUTHORIZED)
}

