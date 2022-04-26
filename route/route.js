const express = require('express');
const codecontrol=require('../codecontroller/codecontroller')
const middleware=require('../middleware/middleware')
const router = express.Router();

router.post('/createauthor',codecontrol.authordata)
router.post('/createblog',codecontrol.blogdata)

module.exports = router;