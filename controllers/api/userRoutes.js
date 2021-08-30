const router = require('express').Router()
const { User } = require('../../models')

// New user: verify and then post new credentials
router.post('/signup', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Existing user: verify credentials and update session
router.post('/login', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Destroy session
router.post('/logout', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Export router
module.exports = router