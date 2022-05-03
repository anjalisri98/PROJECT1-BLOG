const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim:true,
        required:true
    },
    lname: {
        type: String,
        trim:true,
        required:true
    },
    title: {
        type:String,
        trim:true,
        required:true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        unique:true,
        trim:true,
        required:true
    },
    password: {
        type: String,
        trim:true,
        required:true
    }


}, { timestamps: true });

module.exports= mongoose.model('author', authorSchema)