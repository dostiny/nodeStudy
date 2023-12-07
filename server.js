const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send("오늘 비옴");
});

app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();
  console.log(result);
  // res.send(result[0].title);
  res.render("list.ejs", { posts: result });
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.post("/add", async (req, res) => {
  const inputdata = req.body;
  // console.log(inputdata);
  try {
    if (inputdata.title === "" || inputdata.content === "") {
      console.log("데이터가 입력되지 않음");
      res.redirect("/write");
    } else {
      await db
        .collection("post")
        .insertOne({ title: inputdata.title, content: inputdata.content });
      res.redirect("/list");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("서버에러");
  }
});
