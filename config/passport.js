const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

//passing in passport variable from passport config in app.js
module.exports = function(passport) { 
     passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['profile']
     },
     async (accessToken, refreshToken, profile, done)=> {
        //need to match with our UserSchema
        //console.log(profile)
        const newUser = {
            googleId: profile.id, 
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        //console.log(newUser)
        try {
            //store the user in DB
            console.log(newUser)
            let user = await User.findOne({ googleId: profile.id })
            
            if(user){
                done(null, user) //callback ->pass the user in
            } 
            //if there is no user, create new one
            else{
                user = await User.create(newUser)
                done(null, user)
            } 
        } catch (error) {
            console.error(error)
        }
     }))
     passport.serializeUser( (user, done)=>{
        done(null,user.id)
     }) 

     passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) => done(err, user))})
}