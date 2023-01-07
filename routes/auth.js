const express = require('express')
const passport = require('passport')
const router = express.Router()

//  @desc Auth with Google
// @route GET /auth/google
//using google strategy which we created in passport.js
//
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//  @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
    res.redirect('/dashboard') //if succesful redirect to dashboard
});

// @desc Logout User
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
    })
    res.redirect('/')
})




module.exports = router