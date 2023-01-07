//middleware is just function that has access to the req and res objects
//if not logged in then cannot go to the dashboard and if is logged in then cannot go to the login page

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()){
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}