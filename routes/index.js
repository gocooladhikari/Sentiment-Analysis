var router = require('express').Router()

router.get('/', (req, res) => {
    res.render('index', {title: 'Home Page'})
})

module.exports = router