const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const bcrypt = require('bcryptjs')

// DB model
const User = require('./models/User')
const Post = require('./models/Post')

const app = express()

// //DB Config
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => console.log('DB connected')
).catch(err => console.log(err))


// BOdy_Paarser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Express body-parser
app.use(express.urlencoded({extended: true}))

//PUblic directory setup
app.use(express.static(__dirname + '/public'))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Connect flash
app.use(flash())

//Express sessions
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Routes
app.get('/test', (req, res) => {
  res.send('TEst')
})
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Server connected on port: ' + PORT))