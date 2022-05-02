const express = require('express');
const codecontrol=require('../codecontroller/codecontroller')
const middleware=require('../middleware/middleware')
const router = express.Router();

router.post('/authors',codecontrol.authordata)
router.post('/login',codecontrol.loginauthor)
router.post('/blogs',middleware.authentication,codecontrol.blogdata)
router.get('/blogs',middleware.authentication,codecontrol.getBlog)
router.put('/blogs/:blogId',middleware.autherization,codecontrol.blogUpdate)
router.delete('/blogs/:blogId',middleware.autherization,codecontrol.delblog)
router.delete('/blogs',middleware.autherization,codecontrol.delbyquery)


module.exports = router;