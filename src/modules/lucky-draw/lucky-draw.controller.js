const express = require("express");

const router = express.Router();
const { HTTP_STATUS } = require("../common/common-constants");
const ApplicationError = require("../common/classes/application-error");
const { initializeWinningPrize, redeemPrize } = require("./lucky-draw.service");

router.post("/init",  async (req, res, next) => {
  try {
   const data = await initializeWinningPrize();
    return res.send({ message: data.message });
  } catch (error) {
    const errorToBeThrown = new ApplicationError(error.httpCode, req.url, error.message);
    next(errorToBeThrown);
  }
});

router.get("/redeem", async (req, res, next) => {
  try {
    const { address } = req.query;
    const data = await redeemPrize(address);
    return res.send({ data });
  } catch (error) {
    const errorToBeThrown = new ApplicationError(error.httpCode, req.url, error.message);
    next(errorToBeThrown);
  }
});

module.exports = router;
