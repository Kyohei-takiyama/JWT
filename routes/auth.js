const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

// bcrypt
const saltResult = 10; // ストレッチング回数・・・何回ハッシュ化するか？ 2のn乗のnにあたる数値

router.post(
  "/signup",
  // username must be an email
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    // エラーが空だったら、Trueを返す
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const existUser = users.find((user) => user.email === email);
    // 既に登録されたEmailがある場合の処理
    if (existUser)
      return res.status(401).json({ message: "既に登録済みのユーザです..." });

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, saltResult);

    const newUser = {
      email,
      password: hashedPassword,
    };
    users.push(newUser);

    const SEACRET_KEY = process.env.SEACRET_KEY;
    const token = JWT.sign(
      {
        email,
      },
      SEACRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    res.status(201).json({ token });
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((_user) => _user.email === email);

  if (!user)
    return res
      .status(401)
      .json({ message: "メールアドレスかパスワードが無効です..." });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res
      .status(401)
      .json({ message: "メールアドレスかパスワードが無効です..." });

  const token = JWT.sign(
    {
      email,
    },
    process.env.SEACRET_KEY,
    {
      expiresIn: "24h",
    }
  );
  res.json({ token });
});

router.get("/", (req, res) => {
  res.json(users);
});

module.exports = router;
