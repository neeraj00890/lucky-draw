const mongoose = require("mongoose");

const winningPrizeSchema = new mongoose.Schema({
  race: {
    type: String,
    trim: true,
    required: true,
    unique: true

  },
  goldPrizes: {
    type: [String],
    default: [],
    immutable: true
  },
  silverPrizes: {
    type: [String],
    default: [],
    immutable: true
  },
  brownPrizes: {
    type: [String],
    default: [],
    immutable: true
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
