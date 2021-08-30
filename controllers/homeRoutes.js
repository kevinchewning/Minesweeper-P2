const router = require('express').Router()
// const withAuth = require('../utils/auth')

// Render root page
router.get('/', /* withAuth, */ async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json(err)
    }
})

// Render login page
router.get('/login', async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json(err)
    }
})

// Render stats and leaderboards
router.get('/leaderboards', async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json(err)
    }
})

// Export router
module.exports = router