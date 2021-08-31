/**
 * Middleware function which redirects the user to the login page, if they are not logged in.
 */
const withAuth = (req, res, next) => {
    if (!req.session.logged_in) {
        // If not logged in, redirect to the login page
        res.redirect('/login')
    } else {
        // Otherwise, they may precede. Continue middleware handling.
        next()
    }
}
  
module.exports = withAuth