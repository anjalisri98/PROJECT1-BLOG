const authorSchema = require('../model/authormodel')
const blogSchema = require('../model/blogmodel')
const jwt = require('jsonwebtoken')


//===================================================[API:FOR CREATING AUTHOR DB]===========================================================
let authordata = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "plz enter author data" })
        if (!data.fname) return res.status(404).send({ status: false, msg: "fname missing" })
        if (!data.fname.match(/^[a-z]+$/i)) return res.status(400).send({ status: false, msg: "Please Enter a valid First Name" })
        if (!data.lname) return res.status(404).send({ status: false, msg: "lname missing" })
        if (!data.lname.match(/^[a-z]+$/i)) return res.status(400).send({ status: false, msg: "Please Enter a valid Last Name" })
        if (!data.title) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.email) return res.status(404).send({ status: false, msg: "email missing" })
        if (!data.password) return res.status(404).send({ status: false, msg: "password missing" })
        if (!data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res.status(404).send({ status: false, data: "Invalid email" })
        }
        let email = await authorSchema.findOne({ email: data.email })
        if (email) return res.status(400).send({ status: false, msg: "email aleready exist" })
        let result = await authorSchema.create(data)
        return res.status(201).send({ result })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}
//===================================================[TOKEN GENRATOR API]=================================================================
const loginauthor = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        let author = await authorSchema.findOne({ email: userName, password: password }).catch(err => null)
        if (!author)
            return res.status(400).send({
                status: false,
                msg: "username or password is not correct",
            });
        let token = jwt.sign({ authorId: author._id.toString() }, "functionup-uranium");
        res.status(200).send({ status: true, data: token });
    }
    catch {
        res.status(500).send({ statuS: false, msg: err.message })
    }
};
//===================================================[API:FOR CREATING BLOG DB]===========================================================
let blogdata = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "plz enter blog data" })
        if (!data.title) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.body) return res.status(404).send({ status: false, msg: "body missing" })
        if (!data.authorId) return res.status(404).send({ status: false, msg: "authorId missing" })
        if (!data.category) return res.status(404).send({ status: false, msg: "category missing" })
       

        let id = data.authorId
        let validauthor = await authorSchema.findById(id).catch(err => null)
        if (!validauthor) return res.status(404).send({ status: false, msg: "invalid author id" })
        if (req.body.isDeleted === true) {
            let DeletedAt = new Date()
            data.DeletedAt=DeletedAt
          }
          if (req.body.isPublished === true) {
            let publishedAt = new Date()
            data.publishedAt=publishedAt
          }
        let result = await blogSchema.create(data)
        res.send({status:true , data:result})
        
    }
    catch (err) {
        return res.status(500).send({ statuS: false, msg: err.message })
    }
}
//=====================================================[API:FOR GETTING BLOGS]===========================================================
let getBlog = async function (req, res) {
    try {
        let query = req.query;
        let filter = {
            isDeleted: false,
            isPublished: true,
        };
        if (Object.keys(query).length > 0) {
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
        if (filterByquery.length <= 0) {
            return res.status(404).send({ msg: "Blog Not Found" });
        }
        res.status(200).send({ msg: filterByquery });
    } catch (err) {
        return res.status(500).send({ statuS: false, msg: err.message });
    }
};
//===========================================================[API:FOR UPDATE]===============================================================
const blogUpdate = async (req, res) => {
    try {
        let data = req.body
        let id = req.params.blogId
        let authorloged = req.authorverfiy
        if (Object.keys(data).length == 0) {
            return res.status(400).send("Please Enter data for updation")
        }
        const checkBlogId = await blogSchema.findById(id).catch(err => null)
        if (!checkBlogId) return res.status(404).send({ msg: "No blog found with this blogId" })
        if (checkBlogId.isDeleted === true) return res.status(400).send({ msg: "Blog is deleted" })
        if (id) {
            let blogverify = await blogSchema.findOne({ _id: id, authorId: authorloged })
            if (!blogverify) {
                return res.status(403).send({ status: false, data: "Not authorized" })
            }
        }
        if (data.title) checkBlogId.title = data.title;
        if (data.category) checkBlogId.category = data.category;
        if (data.body) checkBlogId.body = data.body;
        //------for tags that is array-----------
        if (data.tags) {
            if (typeof data.tags === "object") {
                checkBlogId.tags.push(...data.tags)
            }
            else if (typeof data.tags === "string") {
                checkBlogId.tags.push(data.tags)
            }
            else {
                return res.status(400).send({ status: false, msg: "Please send tags in array" })
            }
        }
        //-----------for subcategory that is arry------------
        if (data.subcategory) {
            if (typeof data.subcategory === 'object') {
                checkBlogId.subcategory.push(...data.subcategory)
            } else if (typeof data.subcategory === "string") {
                checkBlogId.subcategory.push(data.subcategory)
            }
            else {
                return res.status(400).send({ status: false, msg: "Please send subcategory in array" })
            }
        }
        if (typeof data.isPublished === 'boolean') {
            if (data.isPublished == true) {
                checkBlogId.publishedAt = new Date().toLocaleString();
                checkBlogId.isPublished = true
            } if (data.isPublished == false) {
                checkBlogId.publishedAt = ""
                checkBlogId.isPublished = false
            }
        }
        checkBlogId.save()
        res.status(200).send({ status: true, msg: "blog updated", data: checkBlogId })
    } catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}
//===========================================================[API:FOR-DELETING]=============================================================
let delblog = async (req, res) => {
    try {
        let data = req.params
        let id = data.blogId
        let authorloged = req.authorverfiy
        if (id) {
            let findblog = await blogSchema.findById(id).catch(err => null)
            if (!findblog) return res.status(404).send({ status: false, msg: `no blog found by this BlogID:${id}` })
            let blogverify = await blogSchema.findOne({ _id: id, authorId: authorloged })
            if (!blogverify) {
                return res.status(403).send({ status: false, data: "Not authorized" })
            }
            if (blogverify.isDeleted !== false) { return res.status(404).send({ status: false, msg: "Blog is already deleted" }) }
            await blogSchema.findOneAndUpdate(
                { _id: id },
                {
                    $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() }
                })
            res.status(200).send({ status: true, msg: "Succesful" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}
let delbyquery = async (req, res) => {
    try {
        let data = req.query
        if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "please enter filter for deletion" })
        let query = {
            isDeleted: false,
            authorId: req.authorverfiy
        }
        if (data.tags) {
            data.tags = { $in: data.tags.split(',') }
        }
        if (data.subcategory) {
            data.subcategory = { $in: data.subcategory.split(',') }
        }
        query['$or'] = [
            { title: data.title },
            { isPublished: data.isPublished },
            { authorId: data.authorId },
            { category: data.category },
            { subcategory: data.subcategory },
            { tags: data.tags }
        ]
        let del = await blogSchema.find(query)
        if (del.length == 0) {
            return res.status(404).send({ status: false, msg: "No such blog present or Not authorized to delete blog" })
        }
        const result = await blogSchema.updateMany(
            query, { $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() } })
        res.status(200).send({ status: true, msg: "blogs deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

module.exports={authordata,loginauthor,blogdata,getBlog,blogUpdate,delblog,delbyquery}
