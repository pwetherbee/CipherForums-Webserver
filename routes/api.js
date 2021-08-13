var express = require("express");
const idGen = require("../helpers/generateRandomID");
// const idgen = require("../helpers/generateRandomID");
var router = express.Router();
let SQLHelper = require("../helpers/sqlQueryHelper");
router.use(express.json());

// First forum created: StableBest-sellingNewt

// Get forum from url tag
router.get("/threads/:tag", (req, res) => {
  let urlTag = req.params["tag"];
  // Make sql query
  let connection = SQLHelper.createConnection();
  let query = `
  SELECT * FROM Forums
  WHERE url = "${urlTag}"
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    const id = rows[0]?.id;
    if (!id) {
      res.sendStatus(404);
      return;
    }
    // console.log(rows[0].creationDate);
    const forum = {
      author: "Anonymous",
      id: id,
      title: rows[0].title,
      date: rows[0].creationDate,
      comments: [],
    };
    query = `
    SELECT * FROM Comments
    WHERE forumID = ${forum.id} 
    ORDER BY postTime ASC
    `; //(SELECT id FROM Forums WHERE url = "${urlTag}"
    connection.query(query, function (err, rows, fields) {
      if (err) throw err;
      rows.forEach((row) => {
        if (!row) {
          res.send(forum);
          return;
        }
        let comment = {
          author: "Anonymous",
          time: row.postTime,
          text: row.commentText,
          forumID: row.forumID,
        };
        forum.comments.push(comment);
      });
      res.send(forum);
    });
    connection.end();
  });
});

// Post comment on thread from url

router.post("/threads/:tag", (req, res) => {
  // TODO: Replace with SQL query
  let urlID = req.params["tag"];
  let connection = SQLHelper.createConnection();
  let commentData = req.body;
  if (!commentData) {
    return;
  }
  // console.log("comment post requested");
  // console.log(commentData);
  //commentData.forumID
  let query = `
  INSERT INTO Comments (forumID, commentText, postTime)
  VALUES (${commentData.forumID}, "${commentData.text}", NOW())
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    // console.log("success posting comment");
  });
  connection.end();
  res.send("comment successfully added");
});

router.put("/threads", (req, res) => {
  let connection = SQLHelper.createConnection();
  let urlID = idGen.generateID();
  connection.connect();
  let query = `
  INSERT INTO Forums (url, title, creationDate)
  VALUES ("${urlID}", "${urlID}", NOW());
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    console.log("success");
  });
  connection.end();
  res.send(
    JSON.stringify({
      newID: urlID,
    })
  );
  // if name given, check if name is in data already
  // create template with either anon user or profile name and thread id
});

module.exports = router;
