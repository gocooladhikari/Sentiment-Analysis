const express = require('express')
const app = express()
const router = express.Router()
const multer = require('multer')
const bodyParser = require('body-parser')

const Post = require('../models/Post')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize:1024 * 1024 * 20
    },
    fileFilter: fileFilter
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

router.get('/item', (req, res) => {
    res.render('post', {title: 'Admin Post'})
})

router.post('/item', upload.single('productImage'), (req, res) => {
    console.log(req.file)
    const type = req.body.type
    const brand = req.body.brand
    const model = req.body.model
    const price = req.body.price
    const description = req.body.description
    // const productImage = req.file.path
    const comments = req.body.comments

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
            console.log('Model already exists')
            res.redirect('/')
        }else{
            const newPost = new Post({
                type: type,
                brand: brand,
                model: model,
                price: price,
                description: description,
                // productImage: productImage,
                comments: comments
            })
            newPost.save().then(post => {
                req.flash('success_msg', 'Posted Successfully')
                console.log('posted')
                res.redirect('/')
                // console.log(comments[0].person)
               // console.log('success')
            }).catch(err => console.log(err))
            
    }
})
})

// single item display route
router.route('/item/:postId').get((req, res) => {
    Post.findById(req.params.postId).then(post => {
        if(post){
            console.log('Item found')
            console.log(post)
            res.json(post)
        }else{
            console.log('Not found')
        }
    }).catch(err => console.log(err))
})

// Adding comment route
router.route('/single/:postId').post((req, res) => {
    const person = req.body.person
    const comment = req.body.comment

    Post.findById(req.params.postId).then(post => {
        if(!post){
            console.log('Requested post not available')
        }else{
            post.comments.push({
                person,
                comment
            })
            post.save().then(post => {
                if(!post){
                    console.log('Not done')
                }else{
                    console.log(post)
                    res.json(post)
                }
            })
        }
    }).catch(err => console.log(err))
})


// Display all posts
router.route('/showall').get((req, res) => {
    Post.find().then(post => {
        if(!post){
            console.log('nothing to show')
        }else{
            res.json(post)
        }
    }).catch(err => console.log(err))
})

module.exports = router