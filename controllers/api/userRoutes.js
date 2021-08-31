const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../../models')

// New user: verify and then post new credentials
router.post('/signup', async (req, res) => {
    try {
        // get the new user credentials from the body
        const newUser = req.body

        // Check to see if this user already exists
        const existingUser = await User.findOne({ where: { email: newUser.email } })
        if (existingUser) {
            res.status(400).json({ message: 'This user already exists! Please login.' })
            return
        }

        // hash the password and overwrite
        newUser.password = await bcrypt.hash(req.body.password, 9)

        // create the newUser with the hashed password and save to DB
        const userData = await User.create(newUser)

        // send a response of 200 (success) and our userData object
        res.status(200).json(userData)
    } catch (err) {
        res.status(400).json(err)
    }
})

// Existing user: verify credentials and update session
router.post('/login', async (req, res) => {
    try {
        // get request body credentials
        const loginInfo = req.body

        // get matching user data (if it exists)
        const userData = await User.findOne({ where: { email: loginInfo.email } })

        // check for matching user
        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password.' })
        }

        // check for matching password
        const passwordCorrect = bcrypt.compareSync(loginInfo.password, userData.password)
        if (!passwordCorrect) {
            res.status(400).json({ message: 'Incorrect email or password.' })
        }

        // save data to session
        req.session.save(() => {
            req.session.logged_in = true
        })

        // success response
        res.status(200).json({ user: userData, message: `User '${userData.username}' is now logged in.`})

    } catch (err) {
        res.status(400).json(err)
    }
})

// Destroy session
router.post('/logout', async (req, res) => {
    try {
        // if logged in, destroy session
        if (req.session.logged_in) {
            req.session.destroy(() => {
                res.status(204).end()
            })
        } else {
            // if the user is not logged in, fire a 404
            res.status(404).end()
        }
    } catch (err) {
        res.status(400).json(err)
    }
})

// Export router
module.exports = router