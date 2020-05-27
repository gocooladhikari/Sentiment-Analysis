const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const bodyParser = require('body-parser')

const db = mongoose.connection

//DB model
const User = require('../models/User')
const Post = require('../models/Post')
// Post.create({
//     type: 'app',
//     brand: 'Aud',
//     model: 'qw',
//     price: '2000000',
//     description: 'sssss'
// })

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
    const email = req.body.email
    const password = req.body.password
    
    User.findOne({email: email}).then((user) => {
        if(!user) {
            req.flash('error_msg', 'Email not registered')
            res.redirect('/users/login')
        }else {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                    res.redirect('/users/admin')
                }else{
                    req.flash('error_msg', 'Incorrect password')
                    res.redirect('/users/login')
                }
            })
        }
    })
})

// const ensureAuthenticated = (req, res, next) => {
//     if(req.isAuthenticated()) {
//          next()
//     }
//     res.redirect('/users/login')
// }

router.get('/admin', (req, res) => {
    res.render('post', {title: 'Admin Post'})
})

router.post('/admin', (req, res) => {
    const type = req.body.type
    const brand = req.body.brand
    const model = req.body.model
    const price = req.body.price
    const description = req.body.description

    let errors1 = []

    if( !brand || !model || !price || !description){
        errors1.push({msg: 'Please fill in the required fields'})
    }

    if(price < 500) {
        errors1.push({msg: 'Please check the price again'})
    }

    if(errors1.length > 0) {
        res.render('post', {title: 'Admin Post',
            errors1,
            type,
            brand,
            price,
            description
        })
    }

    Post.findOne({model: model}).then(post => {
        if(post) {
            req.flash('error_msg', 'This model already exists')
            res.redirect('/users/admin')
        }else{
            const newPost = new Post({
                type: type,
                brand: brand,
                model: model,
                price: price,
                description: description
            })
            newPost.save().then(post => {
                req.flash('success_msg', 'Posted Successfully')
                res.redirect('/users/admin')
               // console.log('success')
            }).catch(err => console.log(err))
            
    }
})
})

module.exports = router