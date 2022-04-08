const express = require("express");

const router = express.Router();
const { HTTP_STATUS } = require("../common/common-constants");
const {getToken} = require("./auth.service");

router.post("/token",  async (req, res, next) => {
  try {
      const {username, password} = req.body;
      const token = await getToken({username, password});
      if(!token)  return res.status(HTTP_STATUS.NOT_AUTHORIZED).send({ message: "Invalid Credentials" });
      return res.send({ message: token });
  } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});

module.exports = router;