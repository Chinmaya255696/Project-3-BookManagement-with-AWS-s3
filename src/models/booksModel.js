const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
        trim: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: [String],
        required: true
    },
    reviews: {
        type: Number,
        default: 0,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date, 
        required: true
    },
    bookCover:{
        type:String
    }
   
}, { timestamps: true })

module.exports = mongoose.model('Books', booksSchema)