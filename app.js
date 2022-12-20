const express = require("express");
const bodyParser = require("body-parser");
const AppError = require("./utils/newAppError");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const GlobalRouter = require("./router/GlobalRouter");
const GlobalErrorHandler = require("./controller/ErrorController");
const morgan = require("morgan");
const app = express();

app.use(helmet());

app.use(express.json());

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ["size"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  return next();
});

app.use(cors());
app.use("/", GlobalRouter);

app.all("*", function (req, res, next) {
  const err = new AppError(`Can't find URl`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use(GlobalErrorHandler);

module.exports = app;
