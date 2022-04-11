const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const cors = require("cors");
dotEnv.config()
const {connectDatabase} = require("./src/modules/database/database-connection");
const luckydrawController = require("./src/modules/lucky-draw/lucky-draw.controller")
const authControler = require("./src/modules/auth/auth.controller");
const {verifyTokenMiddleware} = require("./src/modules/auth/auth.service");
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());
const unProtectedRoutes = ["/api/auth/token"]
app.use((req, res, next) => {
    if(unProtectedRoutes.includes(req.url)) {
        next();
    } else {
        verifyTokenMiddleware(req, res, next);
    }
});

app.use("/api/auth", authControler)
app.use("/api/lucky-draw", luckydrawController)

app.use((error, req, res, next) => {
    if (error && error.name === "ApplicationError") {
      error.path = error.path ? error.path : req.url;
      return res.status(error.httpCode).send(error);
    }
    if (error) {
      return res.status(error.status).send(error);
    }
    return next();
  });
  

app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`)
    connectDatabase()
});
