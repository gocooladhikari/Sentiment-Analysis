var router = require('express').Router() 

router.get('/', (req, res, next) => {
    res.send('Route for signin page')
})

module.exports = router