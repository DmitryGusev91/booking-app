const express = require("express");
const usersBLL = require("../BLL/usersBLL");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required!!!").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required!!!"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const existingUser = await usersBLL.getUserByEmail(email);

      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials." });
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials." });
      }

      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: "1h" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      console.log(token);
      return res.status(200).json({ userId: existingUser._id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong." });
    }
  }
);

router.post(
  "/register",
  [
    check("firstName", "First Name is required!!!").isString(),
    check("lastName", "Last Name is required!!!").isString(),
    check("email", "Email is required!!!").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required!!!"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const newUser = req.body;
      const existingUser = await usersBLL.getUserByEmail(newUser.email);

      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
      const userId = await usersBLL.addUser(newUser);

      const token = jwt.sign(
        { userId: userId },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: "1h" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });
      return res.status(200).send({ message: "User registered OK." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong." });
    }
  }
);

router.get("/validate-token", verifyToken, (req, res) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });
  res.send();
});

module.exports = router;
