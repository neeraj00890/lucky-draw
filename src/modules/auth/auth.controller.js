const express = require("express");

const router = express.Router();
const { HTTP_STATUS } = require("../common/common-constants");
const {getToken} = require("./auth.service");
const ApplicationError = require("../common/classes/application-error");

router.post("/token",  async (req, res, next) => {
  try {
      const {username, password} = req.body;
      const token = await getToken({username, password});
      return res.send({ message: token });
  } catch (error) {
    const errorToBeThrown = new ApplicationError(error.httpCode, req.url, error.message);
    next(errorToBeThrown);
  }
});

module.exports = router;