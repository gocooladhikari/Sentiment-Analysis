const express = require('express')
const app = express()
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const bodyParser = require('body-parser')

//DB model
const User = require('../models/User')

// BOdy_Paarser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login Portal'})
})

router.get('/register', (req, res) => {
    res.render('signin', {title: 'Signin Portal'})
})

router.post('/register', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2

    let errors = []

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please enter all fields'})
        // res.render('signin', {message: 'Enter all fields'})
    }

    if(password != password2){
        errors.push({msg: 'Passwords donot match'})
        // res.render('signin', {message: 'Passwords dont match'})
    }

    if(password.length < 6){
        errors.push({msg: 'Password should be atleast 6 characters long'})
        // res.render('signin', {message: 'Password should be atleast 6 characters long'})
    }

    if(errors.length > 0){
        res.render('signin', {
            title: 'Signin Page',
            errors,
            name,
            email,
            password,
            password2
        })
    }

    else{
        User.findOne({email: email}).then(user => {
            if(user){
                 errors.push({msg: 'Email already registered'})
                res.render('signin', {
                    title: 'Signin Page',
                    errors,
                    name,
                    email,
                    password,
                    password2
                    
                })
            }else{
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err
                        newUser.password = hash
                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now registered and can login')
                            res.redirect('/users/login')
                        }).catch(err => console.log(err))
                    })
                })
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(!user) {
            res.render('login', {title: 'Login Portal',msg: 'Email is not registered'})
        }else {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                    res.redirect('/users/secret')
                }else{
                    res.render('login', {title: 'Login Portal', msg: 'Incorrect password'})
                }
            })
        }
    })
})

// Login post route debug
// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', (error, user, info) => {
//         console.log(error)
//         console.log(user)
//         console.log(info)

//         if(error) {
//             res.status(401).send(error)
//         }else if (!user) {
//             res.status(401).send(info)
//         }else{
//             next()
//         }
//     })
// }, (req, res) => {
//     res.status(200).send('logged in')
// })


const ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/users/login')
}

router.get('/secret', ensureAuthenticated, (req, res, next) => {
    res.send('This is secret route')
})

module.exports = router