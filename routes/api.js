var express = require("express");
var router = express.Router();
router.use(express.json());

let forum1 = {
  id: "999",
  author: "Colin",
  comments: [
    {
      author: "Colin",
      time: "1627170251",
      text: "7f741c422a0a640a08312043405371345970035e2d7442435b090b444375767e5c717d536444705c473a086a67077b744336480c534411535352530a0204034b",
    },
    {
      author: "Patrick",
      time: "1627171251",
      text: "5d7c2049170f51371c2532784072543c6a542f7a2e44514d5c450e504152185b40175712535d5f5f520c111e1118584547415e004c4d425b471708594b4a4f4b",
    },
  ],
};

let forum2 = {
  id: "dopeforum",
  author: "Patrick",
  comments: [
    {
      author: "YoMamma",
      time: "1627170251",
      text: "7f741c422a0a640a08312043405371345970035e2d7442435b090b444375767e5c717d536444705c473a086a67077b744336480c534411535352530a0204034b",
    },
    {
      author: "Satoshi",
      time: "1627171251",
      text: "5d7c2049170f51371c2532784072543c6a542f7a2e44514d5c450e504152185b40175712535d5f5f520c111e1118584547415e004c4d425b471708594b4a4f4b",
    },
    {
      author: "Bob",
      time: "1627171321",
      text: "5a7928680b0c61252309104d787d4e3d465e1a5d0550555c52451150135559515847445d5740535f5a070112430453545c151841525207481459174c4211164b",
    },
  ],
};

let forum3 = {
  id: "123",
  author: "Tate",
  comments: [
    {
      author: "Colin",
      time: "1627170251",
      text: "7f741c422a0a640a08312043405371345970035e2d7442435b090b444375767e5c717d536444705c473a086a67077b744336480c534411535352530a0204034b",
    },
    {
      author: "Patrick",
      time: "1627171251",
      text: "5d7c2049170f51371c2532784072543c6a542f7a2e44514d5c450e504152185b40175712535d5f5f520c111e1118584547415e004c4d425b471708594b4a4f4b",
    },
  ],
};

const testdata = {
  999: forum1,
  101: forum2,
  69: forum3,
};

router.get("/threads/:id", (req, res) => {
  let id = req.params["id"];
  res.send(testdata[id]);
});

router.post("/threads/:id", (req, res) => {
  let id = req.params["id"];
  testdata[id].comments.push(req.body);
  res.send("comment successfully added");
});

router.put("/threads", (req, res) => {
  // assign forum id or name
  // if name not given, generate one
  // if name given, check if name is in data already
  // create template with either anon user or profile name and thread id
});

module.exports = router;
