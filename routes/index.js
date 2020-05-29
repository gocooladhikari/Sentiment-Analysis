var router = require('express').Router()

router.get('/', (req, res) => {
    res.render('home_page', {title: 'Home Page'})
})

module.exports = router