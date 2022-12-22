const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Port = 5000;
dotenv.config({ path: "config.env" });
const app = require("./app.js");

const DB = process.env.DB;

mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successfully");
  });

const server = app.listen(Port, () => {
  console.log(`App running on Port ${Port}`);
});
