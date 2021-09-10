const router = require('express').Router()
const { Game } = require('../../models')

// Game finished: post game data
router.post('/', async (req, res) => {
    try {
        // create game
        const gameData = await Game.create(req.body)

        // respond with success code and a copy of the new Game object
        res.status(200).json(gameData)

    } catch (err) {
        res.status(400).json(err)
    }
})

// Export router
module.exports = router