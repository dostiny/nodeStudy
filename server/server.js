const express = require("express");
const app = express();
const path = require("path");

app.listen(8080, () => {
  console.log("http://localhost:8080 에서 서버 실행중");
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "../client/build/index.html");
});

app.get("/news", (req, res) => {
  res.send("오늘 비옴");
});

app.get("*", (req, res) => {
  res.send("오늘 비옴");
});
