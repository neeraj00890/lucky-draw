const express = require("express");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config()
const {connectDatabase} = require("./src/modules/database/database-connection");
const luckydrawController = require("./src/modules/lucky-draw/lucky-draw.controller")
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use("/api/lucky-draw", luckydrawController)
app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`)
    connectDatabase()
})