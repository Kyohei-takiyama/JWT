const JWT = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  let userValid = false;

  const token = req.header("x-auth-token");

  if (!token) return res.json({ message: "無効なトークンです" });

  try {
    const decodedToken = JWT.verify(token, "takiyama");
    userValid = true;
  } catch (error) {}
  if (!userValid) return res.json({ message: "無効なアクセス権です" });

  next();
};
