var router = require('express').Router()

router.get('/', (req, res, next) => {
    res.send('Login page ya aauxa hai guyz!!!')
})

module.exports = router