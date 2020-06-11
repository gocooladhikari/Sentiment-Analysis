const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId
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
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

router.get('/item', (req, res) => {
    res.render('post', {title: 'Admin Post'})
})

router.post('/item', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const type = req.body.type
    const brand = req.body.brand
    const name = req.body.name
    const price = req.body.price
    const description = req.body.description
    const productImage = req.file.filename
    const comments = req.body.comments
    var sort

    let errors1 = []

    if( !brand || !name || !price ){
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

    Post.find().then(posts => {
        if(!posts){
           console.log('Empty Database')
           sort = 0
        }else{
            // console.log(posts.length)
            sort = posts.length
            console.log(sort)
        }
        
    }).catch(err => console.log(err))



    Post.findOne({name: 'hello'}).then(post => {
        if(post) {
            req.flash('error_msg', 'This name already exists')
            console.log('name already exists')
            res.redirect('/')
        }else{
            const newPost = new Post({
                type: type,
                brand: brand,
                name: name,
                price: price,
                description: description,
                productImage: productImage,
                comments: comments,
                sort: sort + 1

            })
            newPost.save().then(post => {
                if(!post){
                   return console.log('Error somewhere')
                }

                // console.log(post.time)
                req.flash('success_msg', 'Posted Successfully!!!')
                res.redirect('/post/display')
                console.log(post.sort)
                // res.alert('Posted Successfully')
                
            })
            
    }
}).catch(err => console.log(err))
})

// Display all posts
router.route('/display').get((req, res, next) => {
    // res.render('items', {title: 'Single Post'})
    var sort = {sort: -1}
    Post.find().sort(sort).then(posts => {
        if(!posts){
            return console.log(err)
        }
        res.render('adminhome', {title: 'Display All', items: posts})
        next()
    }).catch(err => console.log(err))
})

// single item display route
// res.render('items', {
//     title: 'Single Post'
//     // name: post.name,
//     // type: post.type,
//     // image: post.productImage,
//     // price: post.price
// })

router.get('/display/:postId', (req, res) => {
    const id = req.params.postId
    if(mongoose.Types.ObjectId.isValid(id)){
        Post.findOne({_id: new ObjectId(id)}).then(post => {
            if(post){
                console.log(post)
                console.log('Data aayo')
                
                res.render('items', {
                title: 'Single Post',
                name: post.name,
                type: post.type,
                image: post.productImage,
                price: post.price
            })
            }else{
                console.log('No data')
            }
        }).catch(err => console.log(err))
    }else{
        console.log('provide correct id')
    }
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


module.exports = router