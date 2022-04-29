const blogSchema = require('../model/blogmodel')
const jwt = require("jsonwebtoken");


const authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, "functionup-uranium");
        let authorloged = decodedtoken.authorId
        req.authorloged = authorloged
        if (!authorloged) return res.status(401).send({ status: false, msg: "Unauthorized" })
    }
    catch (err) { return res.status(500).send({ status: false, msg: "token is invalid" }); }
    next();
}
const autherization = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, "functionup-uranium");
        let authorloged = decodedtoken.authorId
        if (!authorloged) return res.status(401).send({ status: false, msg: "Unauthorized" })
        let blogid = req.params.blogId
        if (Object.keys(blogid).length > 0) {
            let blogverify = await blogSchema.findOne({ _id: blogid, authorId: authorloged })
            if (!blogverify) {
                return res.status(401).send({ status: false, data: "Not authorized" })
            }
        }
        req.authorloged = authorloged
    }
    catch (err) { return res.status(500).send({ status: false, msg: "token is invalid" }); }
    next();
}
module.exports.authentication = authentication;
module.exports.autherization = autherization;

