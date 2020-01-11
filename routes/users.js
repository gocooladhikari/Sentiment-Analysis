const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//DB model
const User = require('../models/User')


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


module.exports = router