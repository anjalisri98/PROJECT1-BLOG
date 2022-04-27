const express = require('express');
const codecontrol=require('../codecontroller/codecontroller')
const middleware=require('../middleware/middleware')
const router = express.Router();

router.post('/createAuthor',codecontrol.authorData)
router.post('/createBlog',codecontrol.blogData)
router.get ('/getBlog', codecontrol.getBlog)


module.exports = router;