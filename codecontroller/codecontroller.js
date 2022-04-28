const authorSchema = require('../model/authormodel')
const blogSchema = require('../model/blogmodel')
const validator = require('email-validator')

//===================================================API:FOR CREATING AUTHOR DB===========================================================
let authordata = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "plz enter author data" })
        if (!data.fname) return res.status(404).send({ status: false, msg: "fname missing" })
        if (!data.lname) return res.status(404).send({ status: false, msg: "lname missing" })
        if (!data.title) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.email) return res.status(404).send({ status: false, msg: "email missing" })
        if (!data.password) return res.status(404).send({ status: false, msg: "password missing" })
        
        if (validator.validate(data.email)) {
            let result = await authorSchema.create(data)
            return res.status(200).send({ result })
        }
        else {
           return  res.status(404).send({ status: false, data: "Invalid email" })
        }
    }
    catch (err) {
        res.status(500).send({ data: err.message })
    }
}
//===================================================API:FOR CREATING BLOG DB===========================================================
let blogdata = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "plz enter blog data" })
        if (!data.title) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.body) return res.status(404).send({ status: false, msg: "body missing" })
        if (!data.authorId) return res.status(404).send({ status: false, msg: "authorId missing" })
        if (!data.tags) return res.status(404).send({ status: false, msg: "tags missing" })
        if (!data.category) return res.status(404).send({ status: false, msg: "category missing" })
        if (!data.subcategory) return res.status(404).send({ status: false, msg: "authorId missing" })

        let id = data.authorId
        let validauthor = await authorSchema.findById(id).catch(err => null)
        if (!validauthor) return res.status(404).send({ status: false, msg: "invalid author id" })
        let result = await blogSchema.create(data)
        res.status(200).send({ result })
    }
    catch (err) {
        return res.status(500).send(err.message)
    }
}
//=====================================================API:FOR GETTING BLOGS===========================================================
let getBlog = async function (req, res) {
    try {
      let query = req.query;
  
      let filter = {
        isDeleted: false,
        isPublished: true,
      };
      if(Object.keys(query).length>0){
        if (query.tags) {
            query.tags = { $in: query.tags.split(",") };
          }
          if (query.subcategory) {
            query.subcategory = { $in: query.subcategory.split(",") };
          }
          filter['$or'] = [
            { authorId: query.authorId },
            { category: query.category },
            { subcategory: query.subcategory },
            { tags: query.tags },
            { body: query.body },
            { title: query.title },
          ];
      }
    
      let filterByquery = await blogSchema.find(filter)
      if (filterByquery.length<=0) {
        return res.status(404).send({ msg: "Blog Not Found" });
      }
      res.status(200).send({ msg: filterByquery });
    } catch (err) {
      return res.status(500).send({ statuS: false, msg: err.message });
    }
  };
//=================================================API:FOR UPDATE===============================================================
const blogUpdate = async (req, res)=> {
    try {

        let data = req.body
        let id = req.params.blogId
        if (Object.keys(data).length === 0) {
            return res.status(400).send("Please Enter data for updation")
        }
        const checkBlogId = await blogSchema.findById(id).catch(err => null)

        if (!checkBlogId) return res.status(404).send({ msg: "Not a blogId" })

        if (checkBlogId.isDeleted === true) return res.status(400).send({ msg: "Blog is deleted" })

        if (data.title) checkBlogId.title = data.title;
        if (data.category) checkBlogId.category = data.category;
        if (data.body) checkBlogId.body = data.body;
        //------for tags that is array-----------
        if(data.tags){
            if(typeof data.tags === "object"){
                checkBlogId.tags.push(...data.tags)
            }
            else if(typeof data.tags === "string"){
                checkBlogId.tags.push(data.tags)
            }
            else{
                return res.status(400).send({status: false, msg: "Please send tags in array"})
            }
        }
        //-----------for subcategory that is arry------------
        if(data.subcategory){
            if(typeof data.subcategory === "object"){
                checkBlogId.subcategory.push(...data.subcategory)
            }else if(typeof data.subcategory === "string"){
                checkBlogId.subcategory.push(data.subcategory)
            }
            else{
                return res.status(400).send({status: false, msg: "Please send subcategory in array"})
            }
        }
        checkBlogId.isPublished=true
        checkBlogId.publishedAt =new Date().toLocaleString()
        checkBlogId.save()
        return res.status(200).send({ data: checkBlogId })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
//===========================================================API:FOR DELETING================================================================
let delblog = async (req, res) => {
  try {
      let data = req.params
      let id = data.blogid
      let del = await blogSchema.findById(id)
      if (del.isDeleted !== false) { return res.status(404).send({ status: false, msg: "Blog missing" }) }
      await blogSchema.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true,DeletedAt:new Date().toLocaleString() } })
      res.status(200).send({ data: "Blog deleted" })
  }
  catch (err) {
      res.status(500).send({ data: err.message })
  }
}
let delbyquery = async (req, res) => {

    try {
        let data = req.query
        if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "query missing" })
        let query = {
            isDeleted: false,
            isPublished: true
        }
        if (data.tags) {
            data.tags = { $in: data.tags.split(',') }
        }
        if (data.subcategory) {
            data.subcategory = { $in: data.subcategory.split(',') }
        }
        query['$or'] = [{ authorId: data.authorId }, { category: data.category }, { subcategory: data.subcategory }, { tags: data.tags }]

        let del = await blogSchema.find(query)
        if (del.length <= 0) { return res.status(404).send({ status: false, msg: "No such blog present" }) }
        const result = await blogSchema.updateMany(query, { $set: { isDeleted: true,DeletedAt:new Date().toLocaleString() } })
        res.status(200).send({ data: result })
    }
    catch (err) {
        res.status(500).send({ data: err.message })
    }
}

module.exports.authordata = authordata;
module.exports.blogdata = blogdata;
module.exports.delblog = delblog;
module.exports.delbyquery = delbyquery;
module.exports.blogUpdate = blogUpdate;
module.exports.getBlog = getBlog;
