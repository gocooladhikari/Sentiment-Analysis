const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// DB model
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({passReqToCallback: true}, (req, email, password, done) => {
            // Check user in DB
            User.findOne({email: email}).then(user => {
                if(!user){
                    return done(null, false, {msg: 'Email is not registered'})
                }else{
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) console.log(err)
                        if(isMatch) {
                            return done(null, user)
                        }else {
                            return done(null, false, {msg: 'Incorrect Password'})
                        }
                    })
                }
                
            }).catch(err => console.log(err))
        })
    )
 }

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    done(null, { id })
    })