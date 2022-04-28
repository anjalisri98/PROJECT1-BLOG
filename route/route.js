const express = require('express');
const codecontrol=require('../codecontroller/codecontroller')
const router = express.Router();

router.post('/createauthor',codecontrol.authordata)
router.post('/createblog',codecontrol.blogdata)
router.get('/getblog',codecontrol.getBlog)
router.put('/blogupdate/:blogId',codecontrol.blogUpdate)
router.delete('/deleteblog/:blogid',codecontrol.delblog)
router.delete('/deletebyquery',codecontrol.delbyquery)


module.exports = router;