const express = require("express");
const router = express.Router();
const { privatePosts, publicPosts, users } = require("../db");
const checkAuth = require("../middleware/checkAuth");
require("dotenv").config();

router.get("/public", (req, res) => {
  res.json(publicPosts);
});
router.get("/private", checkAuth, (req, res) => {
  res.json(privatePosts);
});

module.exports = router;
