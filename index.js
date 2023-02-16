const express = require("express");
const app = express();
require("dotenv").config();
const AuthRouter = require("./routes/auth");
const PostsRouter = require("./routes/posts");

const PORT = process.env.PORT;

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/posts", PostsRouter);

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(PORT, () => console.log("server started..."));
