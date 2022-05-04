const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    authorId: {
        type: ObjectId,
        trim: true,
        required: true,
        ref: 'author'
    },
    tags: [
        {
            type: String,
            trim: true,
        }],
    category: {
        type: String,
        trim: true,
        required: true
    },

    subcategory: [
        {
            type: String,
            trim: true,
        }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    DeletedAt: {
        type: String,
        default: " "
    },

    isPublished: {
        type: Boolean,
        default:false
    },
    publishedAt: {
        type: String,
        default:" "
    },

}, { timestamps: true })

module.exports = mongoose.model('blog', blogSchema)