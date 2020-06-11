var router = require('express').Router()
var Post = require('../models/Post')

router.get('/', (req, res) => {

    Post.find().sort({sort: -1}).then(posts => {
        if(!posts){
            return console.log('Error found')
        }
        res.render('home_page', {title: 'Home Page', posts: posts})

    }).catch(err => console.log(err))

    
})

module.exports = router