const router = require('express').Router()
const withAuth = require('../utils/auth')

// Render root page
router.get('/', withAuth, async (req, res) => {
    try {
        /* 
            const gameInstance = initialize the game here
        */
        
        res.render('minesweeper', {
            //game: gameInstance,
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
        let userStats = undefined

        // Check to see if user is logged in. If they are, get the userStats
        if (res.session.logged_in) {
            userStats = fetch(`/api/stats/${res.session.user.id}`)
        }
        
        // get leaderboards to be displayed
        const leaderboardList = fetch('/api/leaderboards', {
            method: 'GET'
        })

        // render page and send data for handlebars
        res.render('leaderboards', {
            logged_in: req.session.logged_in,
            userStats: userStats,
            leaderboardList: leaderboardList
        })

    } catch (err) {
        res.status(500).json(err)
    }
})

// Export router
module.exports = router