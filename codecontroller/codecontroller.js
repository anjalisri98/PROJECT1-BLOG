const authorSchema=require('../model/authormodel')
const blogSchema=require('../model/blogmodel')

let authordata=async (req,res)=>{
    let data=req.body
    let result=await authorSchema.create(data)
    res.status(200).send({result})
}
let blogdata=async (req,res)=>{
    let data=req.body
    let result=await blogSchema.create(data)
    res.status(200).send({result})
}
module.exports.authordata=authordata;
module.exports.blogdata=blogdata;
