const express = require('express');
const codecontrol=require('../codecontroller/codecontroller')
const middleware=require('../middleware/middleware')
const router = express.Router();

router.post('/createauthor',codecontrol.authordata)
router.post('/authorlogin',codecontrol.loginauthor)
router.post('/createblog',middleware.authentication,codecontrol.blogdata)
router.get('/getblog',middleware.authentication,codecontrol.getBlog)
router.put('/blogupdate/:blogId',middleware.autherization,codecontrol.blogUpdate)
router.delete('/deleteblog/:blogId',middleware.autherization,codecontrol.delblog)
router.delete('/deletebyquery',middleware.authentication,codecontrol.delbyquery)


module.exports = router;