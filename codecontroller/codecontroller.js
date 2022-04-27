const authorSchema = require("../model/authormodel");
const blogSchema = require("../model/blogmodel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const validator = require("email-validator");
const blogmodel = require("../model/blogmodel");

let authorData = async (req, res) => {
  try {
    let data = req.body;
    if (validator.validate(data.email)) {
      let result = await authorSchema.create(data);
      res.status(200).send({ result });
    } else {
      res.status(404).send({ status: false, data: "Invalid email" });
    }
  } catch (err) {
    res.status(404).send({ data: err.message });
  }
};

let blogData = async function (req, res) {
  try {
    let data = req.body;
    let result = await blogSchema.create(data);
    res.status(200).send({ result });
  } catch (err) {
    res.status(404).send({ data: err.message });
  }
};

let getBlog = async function (req, res) {
  try {
    let query = req.query;

    let filter = {
      isDeleted: false,
      isPublished: true,
      ...query,
    };
    let filterByquery = await blogSchema.find(filter);
    if (filterByquery.length == 0) {
      return res.status(400).send({ msg: "Blog Not Found" });
    } else {
      return res.status(200).send({ msg: filterByquery });
    }
  } catch (err) {
    return res.status(500).send({ statue: false, msg: err.message });
  }
};

module.exports.authorData = authorData;
module.exports.blogData = blogData;
module.exports.getBlog = getBlog;
