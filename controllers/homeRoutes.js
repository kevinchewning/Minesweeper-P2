const router = require('express').Router()
const withAuth = require('../utils/auth')

// Render root page
router.get('/', withAuth, async (req, res) => {
    try {
        /* 
            const gameInstance = initialize the game here
        */
        
        res.render('minesweeper', {
            //game: gameInstance
            logged_in: req.session.logged_in
        })

    } catch (err) {
        res.status(500).json(err)
    }
})

// Render login page
router.get('/login', async (req, res) => {
    try {
        // if the user is already logged in, redirect
        if (req.session.logged_in) {
            res.redirect('/')
        } else {
            res.render('login')
        }
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