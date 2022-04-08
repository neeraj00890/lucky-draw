const express = require("express");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config()
const {connectDatabase} = require("./src/modules/database/database-connection");
const luckydrawControler = require("./src/modules/lucky-draw/lucky-draw.controller")
const authControler = require("./src/modules/auth/auth.controller");
const {verifyTokenMiddleware} = require("./src/modules/auth/auth.service");
const PORT = process.env.PORT || 3000;

app.use(express.json())
const unProtectedRoutes = ["/api/auth/token"]

app.use((req, res, next) => {
    if(unProtectedRoutes.includes(req.url)) {
        next();
    } else {
        verifyTokenMiddleware(req, res, next);
    }
})
app.use("/api/auth", authControler)

app.use("/api/lucky-draw", luckydrawControler)

app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`)
    connectDatabase()
})