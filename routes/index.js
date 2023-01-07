const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story') //require model

//  @desc Login/Landing page
// @route GET /
router.get('/',ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

//  @desc Dashboard
// @route GET /dashboard
router.get('/dashboard',ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id}).lean() //find logged in user match the id, lean is passing in object as a JS friendly
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})






module.exports = router