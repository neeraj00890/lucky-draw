const mongoose = require("mongoose");

const winningPrizeSchema = new mongoose.Schema({
  goldPrizes: {
    type: [String],
    default: []
  },
  silverPrizes: {
    type: [String],
    default: []
  },
  brownPrizes: {
    type: [String],
    default: []
  },
  availableGoldPrizes: {
    type: [String],
    default: []
  },
  availableSilverPrizes: {
    type: [String],
    default: []
  },
  availablebrownPrizes: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("WinningPrize", winningPrizeSchema, "WinningPrize");
