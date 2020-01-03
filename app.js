var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var passport = require('passport')
var expressValidator = require('express-validator')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer') 
var upload = multer({dest: './uploads'})
var mongo = require('mongodb')
var mongoose = require('mongoose')
var flash = require('connect-flash')
var db = mongoose.connection

var indexRouter = require('./routes/index')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
 
 app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

//Handle Sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

//Passport
app.use(passport.initialize())
app.use(passport.session())

// Validator
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']'
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     }
//   }
// }))

app.use(require('connect-flash')())
app.use((req, res, next) => {
  res.locals.message = require('express-message')(req, res)
  next()
})


app.listen(3000, () => {
    console.log('server is up and running on port 3000')
})