const router = require('express').Router()

const Post = require('../models/Post')

router.route('/viewall').get((req, res) => {
    Post.find().then(post => {
        if(post){
           for(var i=0; i<post.length; i++){
                res.json()
                console.log(post[i].comments)
            }

        }else{
            
             console.log('oNOthing to show')
            // console.log(post)
        }
    }).catch(err => console.log(err))
})

router.route('/view/:postId').get((req, res) => {
    Post.findById(req.params.postId).then(post => {
        if(!post){
            console.log('Post not found!!!')
        }else{
            res.json(post.comments[0].comment)
            console.log(post.comments[0].comment)
        }
    })
})

module.exports = router