const router = require('express').Router()
const apiRoutes = require('./api')
const homeRoutes = require('./homeRoutes')

// Add all routes to router
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// Export router, with all routes added
module.exports = router;