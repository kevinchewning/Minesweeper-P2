const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../../models')

// New user: verify and then post new credentials
router.post('/signup', async (req, res) => {
    try {
        // Check to see if this user already exists
        //Email
        const existingUserEmail = await User.findOne({ where: { email: req.body.email } })
        if (existingUserEmail) {
            res.status(400).json({ message: 'This user already exists! Please login.' })
            return;
        }

        //Username
        const existingUsername = await User.findOne({ where: { email: req.body.username } })
        if (existingUsername) {
            res.status(400).json({ message: 'This user already exists! Please login.' })
            return;
        }

        const dbUserData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        });


        req.session.save(() => {
            req.session.user = dbUserData;
            req.session.logged_in = true;

            res.json({ user: dbUserData, message: 'You are now signed up!' })
        });        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Existing user: verify credentials and update session
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
    
        if (!userData) {
          res
            .status(400)
            .json({ message: 'Incorrect email, please try again' });
          return;
        }
    
        const validPassword = await userData.checkPassword(req.body.password);
            
        if (!validPassword) {
          res
            .status(400)
            .json({ message: 'Incorrect password, please try again' });
          return;
        }
    
        userData.get({plain: true})

        req.session.save(() => {
          req.session.user = userData
          req.session.logged_in = true;
          
          res.json({ user: userData, message: 'You are now logged in!' });
        });
    
    
    } catch (err) {
        res.status(400).json(err);
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