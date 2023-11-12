const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { createSecretToken } = require("../util/token");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username", success: false });
    }

    if (!password) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }

    // You can generate a token here
    const token = createSecretToken(user._id);

    // Send the token back as a response, not storing in localStorage
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    console.error(error);

    // Extended error message
    res
      .status(500)
      .json({ message: `Server error: ${error.message}`, success: false });
  }
});

module.exports = router;
