const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/bookingDB")
    .then(() => console.log("Connected to bookingDB"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
