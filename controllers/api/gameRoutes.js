const router = require('express').Router()
const { Game } = require('../../models')

// Game finished: post game data
router.post('/games', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Get a list of the users games
router.get('/games/:user_id', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Get all games
router.get('/games', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Get user stats
router.get('/stats/:user_id', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Get leaderboards
router.get('/leaderboards', async (req, res) => {
    try {

    } catch (err) {
        res.status(400).json(err)
    }
})

// Export router
module.exports = router