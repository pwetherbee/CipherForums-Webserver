var express = require("express");
const idGen = require("../helpers/generateRandomID");
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
  // Connect to database
  connection.connect();
  // Send Query and read result
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    const id = rows[0]?.id;
    if (!id) {
      res.sendStatus(404);
      return;
    }

    const forum = {
      author: "Anonymous",
      id: id,
      title: rows[0].title,
      date: rows[0].creationDate,
      comments: [],
    };
    query = `
    SELECT Comments.postTime, Comments.commentText, Comments.forumID, Users.username FROM Comments
    LEFT JOIN Users
    ON Comments.authorID = Users.userID
    WHERE forumID = ${id}
    ORDER BY Comments.postTime ASC
    `; //(SELECT id FROM Forums WHERE url = "${urlTag}"

    //TODO: Escape callback hell here

    connection.query(query, function (err, rows, fields) {
      if (err) throw err;

      // const authorIDs = rows.map((row) => row.authorID);

      rows.forEach((row, i) => {
        if (!row) {
          res.send(forum);
          return;
        }
        // Generate comment for every row returned in SQL

        let comment = {
          author: row.username || "Anonymous",
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
  let urlID = req.params["tag"];
  let connection = SQLHelper.createConnection();
  let commentData = req.body;
  if (!commentData) {
    return;
  }
  // if (req.session.userID) {
  //   // get user id
  //   let id = req.session.userID
  // }
  // Make SQL query to post new thread
  console.log(req.session.userID);
  let query = `
  INSERT INTO Comments (forumID, authorID, commentText, postTime)
  VALUES (${commentData.forumID}, ${req.session.userID || "NULL"}, "${
    commentData.text
  }", NOW())
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
  });
  connection.end();
  res.send("comment successfully added");
});

// SQl query to generate and return a new random thread
router.put("/threads", (req, res) => {
  // Generate random thread ID
  let urlID = idGen.generateID();
  // Connect to database
  let connection = SQLHelper.createConnection();
  connection.connect();
  let query = `
  INSERT INTO Forums (url, title, creationDate)
  VALUES ("${urlID}", "${urlID}", NOW());
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log("success");
  });
  connection.end();
  res.send(
    JSON.stringify({
      newID: urlID,
    })
  );
});

module.exports = router;
