const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HTTP_STATUS } = require("../common/common-constants");


function verifyToken(token) {
    try {
        const payload = jwt.verify(token, process.env.SECRET)
        return payload ? true: false;
    } catch (error) {
        console.log(error.message)
        return false;
    }
    
}

exports.getToken = async function (args) {
    const { username, password } = args;
    console.log(args)
    if(username === process.env.USER_NAME && bcrypt.compareSync(password, process.env.USER_PASS)) {
      return jwt.sign({username}, process.env.SECRET, {
          expiresIn: "1d"
      })
    }
  };

exports.verifyTokenMiddleware = function(req, res, next) {
    const token = req.headers["authorization"]?.substring(7);
    if(token && verifyToken(token)) return next();
    else return res.status(HTTP_STATUS.NOT_AUTHORIZED).send({message: "You are not authorized.!"});
}

