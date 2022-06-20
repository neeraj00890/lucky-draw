const express = require("express");

const router = express.Router();
const { HTTP_STATUS } = require("../common/common-constants");

const { initializeWinningPrize, redeemPrize, fetchGoldSilverUsers } = require("./lucky-draw.service");

router.post("/init",  async (req, res, next) => {
  try {
   const data = await initializeWinningPrize(req.body);
    return res.send({ message: data.message });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});

router.get("/redeem", async (req, res, next) => {
  try {
    const { address, race } = req.query;
    const data = await redeemPrize(address, race);
    return res.send({ data });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});

router.get("/gold-silver-users", async (req, res, next) => {
  try {
    const {race} = req.query;
    const data = await fetchGoldSilverUsers(race);
    return res.send({ data });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});
module.exports = router;
