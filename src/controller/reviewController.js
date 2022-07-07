const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const reviewModel = require("../models/reviewModel");

const createReview = async function(req, res){
    let data = req.body
    let BookId = req.params.bookId
    const reviewData = await reviewModel.create(data)
 
    return res.status(201).send(reviewData)
}
module.exports.createReview=createReview