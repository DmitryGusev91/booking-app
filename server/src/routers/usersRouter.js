const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const userBLL = require("../BLL/usersBLL");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userBLL.getUserById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
