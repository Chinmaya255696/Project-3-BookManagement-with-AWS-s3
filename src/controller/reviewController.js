const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const reviewModel = require("../models/reviewModel");

const createReview = async function(req, res){
    let data = req.body
    let BookId = req.params.bookId
    const reviewData = await reviewModel.create(data)
    const countData = await reviewModel.countDocuments({bookId:BookId}) 
 const updateReview =  await booksModel.findByIdAndUpdate({_id:BookId},{$set:{reviews:countData}}, {new:true})
    return res.status(201).send(reviewData)
}
module.exports.createReview=createReview