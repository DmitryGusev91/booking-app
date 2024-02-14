const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { v2: cloudinary } = require("cloudinary");
const mongoose = require("mongoose");
const path = require("path");

const authRouter = require("./routers/authRouter");
const myHotelsRouter = require("./routers/myHotelRouter");
const hotelsRouter = require("./routers/hotelsRouter");
const usersRouter = require("./routers/usersRouter");
const bookingRouter = require("./routers/my-bookings");

const app = express();
app.use(cookieParser());
const port = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/auth", authRouter);
app.use("/my-hotels", myHotelsRouter);
app.use("/hotels", hotelsRouter);
app.use("/users", usersRouter);
app.use("/my-bookings", bookingRouter);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
