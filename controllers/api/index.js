const router = require('express').Router()
const userRoutes = require('./userRoutes')
const gameRoutes = require('./gameRoutes')

//Add routes to express router object
router.use('/', userRoutes)
router.use('/games/', gameRoutes)

//Export router
module.exports = router