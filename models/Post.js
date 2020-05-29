const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    type: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [{
        person: '',
        comment: ''
        // created_at: new Date()
    }],
    productImage: {
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post