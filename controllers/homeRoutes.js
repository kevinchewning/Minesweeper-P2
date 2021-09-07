const router = require('express').Router()
const { Game, User } = require('../models')
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

// Render signup page
router.get('/signup', async (req, res) => {
    res.render('signup');
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
});

// Render stats and leaderboards
/*router.get('/leaderboards', async (req, res) => {
    try {
        //Retrieve Data Before Converting to Stats
        const dbUserGameData = await Game.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: ['score', 'duration', 'win' , 'player_moves']
        })

        const dbGameData = await Game.findAll({
            where: {
                win: true
            },
            attributes: ['score', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        })

        const userGameData = dbUserGameData.map((x) => x.get({ plain: true }))

        const gameData = dbGameData.map((x) => x.get({ plain: true }))

        //Average Score
        const userAvgScore = () => {
            let totalScore = 0;

            for(i = 0; i < userGameData.length; i++) {
                totalScore += userGameData.score
            }

            return totalScore / userGameData.length;
        }

        //# of Wins
        const userWins = () => {
            let wins = 0

            for(i = 0; i < userGameData.length; i++) {
                if (userGameData.win) {
                    wins++
                }
            }

            return wins;
        }

         //# of Losses
         const userLosses = () => {
            let losses = 0

            for(i = 0; i < userGameData.length; i++) {
                if (!userGameData.win) {
                    losses++
                }
            }

            return losses;
        }

        //Best Score
        const bestScore = () => {
            let topScore = 0

            for(i = 0; i < userGameData.length; i++) {
                if(userGameData.score > topScore) {
                    topScore = userGameData.score
                }
            }

            return topScore;
        }

        //Worst score
        const worstScore = () => {
            let bottomScore = 10000000000

            for(i = 0; i < userGameData.length; i++) {
                if(userGameData.score < bottomScore) {
                    bottomScore = userGameData.score
                }
            }

            return bottomScore;
        }

        //Immediate Losses
        const immediateLosses = () => {
            let immediateLosses = 0

            for(i = 0; i < userGameData.length; i++) {
                if (userGameData.player_moves === 1) {
                    immediateLosses++
                }
            }

            return immediateLosses;
        }

        //Create stats object
        const stats = {
            avgScore: userAvgScore,
            wins: userWins,
            losses: userLosses,
            bestScore: bestScore,
            worstScore: worstScore,
            immediateLosses: immediateLosses
        }

        //Sort game data by score
        const leaders = () => {
            let scores = dbGameData.sort((a, b) => b.score - a.score)
            
            scores.splice(10)

            return scores;
        }

        //Render page with new objects
        res.render('leaderboards')//, {
           // stats,
           // leaders,
           // logged_in: req.session.logged_in
       // })

    } catch (err) {
        res.status(500).json(err)
    }
})*/
router.get('/leaderboards', (req, res) => {
    res.render('leaderboards');
});

// Export router
module.exports = router