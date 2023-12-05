const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://admin:qwer1234@cluster0.tfgaly2.mongodb.net/?retryWrites=true&w=majority";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("nodeStudy");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/news", (req, res) => {
  db.collection("post").insertOne({ title: "어쩌구" });
  // res.send("오늘 비옴");
});
