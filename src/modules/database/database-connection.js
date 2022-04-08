const mongoose = require("mongoose");
exports.connectDatabase = () => {
  mongoose.connect(process.env.DB_URI, {
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
