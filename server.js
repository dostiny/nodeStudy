const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 메인페이지
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 페이지 이동
app.get("/news", (req, res) => {
  res.send("오늘 비옴");
});

// list.ejs 페이지 띄우기
app.get("/list", async (req, res) => {
  let result = await db.collection("post").find().toArray();
  console.log(result);
  // res.send(result[0].title);
  res.render("list.ejs", { posts: result });
});

// 글쓰는 페이지 이동
app.get("/write", (req, res) => {
  res.render("write.ejs");
});

// 글쓰는 페이지에서 폼 데이터 저장
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

// 디테일 페이지
app.get("/detail/:id", async (req, res) => {
  // console.log(req.params);
  try {
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });
    console.log(result);
    res.render("detail.ejs", { post: result });
  } catch (err) {
    console.log(err);
    res.status(400).send("이상한 url 접속함");
  }
});

// 수정 페이지
app.get("/edit/:id", async (req, res) => {
  try {
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(req.params.id) });
    console.log(result);
    res.render("edit.ejs", { post: result });
  } catch (err) {
    console.log(err);
  }
});

// 수정
app.post("/edit", async (req, res) => {
  const inputdata = req.body;
  try {
    if (inputdata.title === "" || inputdata.content === "") {
      console.log("데이터가 입력되지 않음");
      res.redirect("/write");
    } else {
      await db
        .collection("post")
        .updateOne(
          { _id: new ObjectId(inputdata.id) },
          { $set: { title: inputdata.title, content: inputdata.content } }
        );
      res.redirect("/list");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("서버에러");
  }
});
