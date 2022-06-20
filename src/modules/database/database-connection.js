const mongoose = require("mongoose");
exports.connectDatabase = () => {
  mongoose.connect("mongodb://localhost:27017/blocksport", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
 
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on("error", (err) => console.error("Database error!!", err));
  db.once("open", () => {
      console.log("Database connected!!")
  });
};
