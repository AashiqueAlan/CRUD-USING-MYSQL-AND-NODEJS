const express = require("express");
const router = express.Router();
const objectId = require("mongodb").ObjectId;
const assert = require("assert");
const { MongoClient } = require("mongodb");
let url = "mongodb://localhost:27017/test";
router.get("/", function (req, res) {
  res.render("index");
});
router.get("/get-data", function (req, res) {
  let resultArray = [];
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    const dbo = db.db("test");
    let cursor = dbo.collection("user-data").find();
    cursor.forEach(
      function (doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function () {
        res.render("index", { items: resultArray });
      }
    );
  });
});
router.post("/insert", function (req, res) {
  let item = {
    name: req.body.name,
    year: req.body.year,
    gender: req.body.gender,
  };
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    const dbo = db.db("test");
    dbo.collection("user-data").insertOne(item, function (err) {
      assert.equal(null, err);
      console.log("Item inserted");
    });
  });
  res.redirect("/");
});
router.post("/update", function (req) {
  let item = {
    name: req.body.name,
    year: req.body.year,
    gender: req.body.gender,
  };
  let id = req.body.id;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    const dbo = db.db("test");
    dbo
      .collection("user-data")
      .updateOne({ _id: objectId(id) }, { $set: item }, function (err) {
        assert.equal(null, err);
        console.log("Item updated");
      });
  });
});
router.post("/delete", function (req) {
  let id = req.body.id;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    const dbo = db.db("test");
    dbo
      .collection("user-data")
      .deleteOne({ _id: objectId(id) }, function (err) {
        assert.equal(null, err);
        console.log("Item deleted");
      });
  });
});
module.exports = router;
