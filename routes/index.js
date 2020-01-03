var router = require('express').Router()

router.get('/', (req, res, next) => {
    res.send('This is homepage route!!!')
})

module.exports = router