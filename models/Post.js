const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    type: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    comments: [{
        person: '',
        comment: ''
        // created_at: new Date()
    }],
    productImage: {
        type: String
    },
    sort: {
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post