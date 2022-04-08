const express = require("express");

const router = express.Router();
const { HTTP_STATUS } = require("../common/common-constants");
const messages = require("../common/response-messages");

const { initializeWinningPrize, redeemPrize } = require("./lucky-draw.service");

router.get("/init", async (req, res, next) => {
  try {
    await initializeWinningPrize();
    return res.send({ message: messages.SUCCESS_INIT_SCRIPT });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});

router.get("/redeem", async (req, res, next) => {
  try {
    const { address } = req.query;
    const data = await redeemPrize(address);
    return res.send({ data });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});

module.exports = router;
