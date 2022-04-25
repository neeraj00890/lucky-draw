const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
 races: [
     {
         name: { type: String },
        prizes: {type: mongoose.Types.ObjectId, ref: "WinningPrize" }

     }
 ]
});
module.exports = mongoose.model("Races", raceSchema, "Races");
