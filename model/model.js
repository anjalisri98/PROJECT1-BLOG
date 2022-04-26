const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }


}, { timestamps: true });


const blogSchema = new mongoose.Schema({
    title: {
        typr: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "author"
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },

    subcategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports.blogSchema = mongoose.model('blog', blogSchema)
module.exports.authorSchema = mongoose.model('author', authorSchema)