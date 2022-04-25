const mongoose = require("mongoose");
const {WINNING_TYPES} = require("../common/common-constants")

const luckydrawRedemptionSchema = new mongoose.Schema({
 address: { type: String, required: true, trim: true},
 winningType: {
     type: String,
     enum: Object.values(WINNING_TYPES)
 },
 winningNumber: {
     type: Number
 },
 race: {
     type: String,
     trim: true,
     required: true
 }
});

module.exports = mongoose.model("LuckydrawRedemption", luckydrawRedemptionSchema, "LuckydrawRedemption");
