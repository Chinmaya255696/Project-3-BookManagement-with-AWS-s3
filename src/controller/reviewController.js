const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const reviewModel = require("../models/reviewModel");

const createReview = async function(req, res){
    let data = req.body
    let BookId = req.params.bookId

        if (Object.keys(data).length == 0) 
            { return res.status(400).send({status: false, msg: "Please provide your Book details in body"}) };

        if (!(/^[0-9a-fA-F]{24}$/.test(data.bookId))) 
            { return res.status(400).send({ status: false, message: "BookId format isn't correct" }) }

        if (!data.bookId || data.bookId.trim().length == 0) 
            { return res.status(400).send({ status: false, msg: "BookId field is required" }) };

        if (!data.reviewedBy || data.reviewedBy.trim().length == 0)
            { return res.status(400).send({ status: false, msg: "ReviewedBy field is required" }) };

        if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.reviewedBy))) 
            {return res.status(400).send({ status: false, msg: "ReviewedBy should be in alphabat type" })};

        if (!data.reviewedAt || data.reviewedAt.trim().length == 0) 
            { return res.status(400).send({ status: false, msg: "ReviewedAt field is required" }) };

        if (!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(data.reviewedAt))) 
            { return res.status(400).send({ status: false, message: "ReviewedAt format should be in YYYY-MM-DD" }) };

        if (!data.rating ) 
            { return res.status(400).send({ status: false, msg: "Rating field is required" }) };

        if (!(/^[0-5]{1,5}$/.test(data.rating))) 
            { return res.status(400).send({ status: false, message: "Rating should be in between 1 to 5" }) };

        if((data.isDeleted)===true)
            return res.status(400).send({status:false,msg:"This field value sholud be false"})

    let checkBook = await booksModel.findOne({ _id: BookId, isDeleted: false });
        if (!checkBook) 
            { return res.status(404).send({ status: false, message: "BookId Not Found" }) };

    const reviewData = await reviewModel.create(data)

    let finalData={
        _id:reviewData._id,
        bookId:reviewData.bookId,
        reviewedBy:reviewData.reviewedBy,
        reviewedAt:reviewData.reviewedAt,
        rating:reviewData.rating,
        review:reviewData.review
    }

    const countData = await reviewModel.countDocuments({bookId:BookId}) 
    const updateReview =  await booksModel.findByIdAndUpdate({_id:BookId},{$set:{reviews:countData}}, {new:true})

        {return res.status(201).send(finalData)}
}

const updateReview = async function (req, res) {
    try {
      let bookId = req.params.bookId;
      let reviewId = req.params.reviewId;
      let data = req.body;
  
      if (!/^[0-9a-fA-F]{24}$/.test(bookId)) {
        return res.status(400).send({ status: false, message: "BookId format isn't correct" });}
  
      let book = await booksModel.findById({ _id: bookId });
      if (!book || book.isDeleted == true) {
        return res.status(404).send({ status: false, message: "No Book Found by this BookId" });
      }
  
      if (!/^[0-9a-fA-F]{24}$/.test(reviewId)) {
        return res.status(400).send({ status: false, message: "ReviewId format isn't correct" });}
  
      let review = await reviewModel.findById({ _id: reviewId });
      if (!review || review.isDeleted == true) {
        return res.status(404).send({ status: false, message: "No Review Found by this reviewId" });}
  
      if (Object.keys(data).length == 0) {
        return res.status(400).send({status: false,msg: "Please provide your Review details in body",});}
  
      if(data.reviewedBy){
          if (!data.reviewedBy.match(/^[a-zA-Z. ]+$/)) {
          return res.status(400).send({ status: false, msg: "Reviewer can't be a number" })
          }}
      if(data.rating){
              if (!(data.rating >= 1 && data.rating <= 5)) {
              return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
              }}
               
  
      let updatedReview = await reviewModel.findOneAndUpdate(
        { _id: reviewId },{$set: {reviewedBy:data.reviewedBy, rating:data.rating, review: data.review},},{ new: true });
  
        let result=book.toObject()
      result.reviewsData=updateReviewData 
      {return res.status(200).send({ status: true, message: "Books list", data: result });}
  
    } catch (err) {
      {return res.status(500).send({ status: false, msg: "Error", error: err.message });}}
  };
  
  const deleteReview = async function (req, res) {
    try {
      let book_id = req.params.bookId;
      let review_id = req.params.reviewId;
  
      if (!/^[0-9a-fA-F]{24}$/.test(book_id)) {return res.status(400).send({ status: false, message: "BookId format isn't correct" });}
  
      let checkBook = await booksModel.findOne({ _id: book_id,isDeleted: false,});
  
      if (!checkBook) {
        return res.status(404).send({ status: false, message: "Book is already deleted" });}
  
      if (!/^[0-9a-fA-F]{24}$/.test(review_id)) {
        return res.status(400).send({ status: false, message: "ReviewId format isn't correct" });}
  
      let checkReview = await reviewModel.findOne({_id: review_id,isDeleted: false,});
  
      if (!checkReview) {
        return res.status(404).send({ status: false, message: "Review is already deleted" });}
  
      const deleteReviewData = await reviewModel.findOneAndUpdate({ _id: checkReview._id },{ $set: { isDeleted: true, deletedAt: new Date() } },{ new: true });
  
      if (deleteReviewData) {
          await booksModel.findOneAndUpdate({ _id: book_id },{$inc:{ reviews: -1 }})
           }
  
      {
        return res.status(200).send({ status: true, message: "Review is deleted succesfully",data:deleteReviewData });
      }
    } catch (err) {
      {
        return res.status(500).send({ status: false, error: err.message });
      }
    }
  };
  module.exports = { updateReview,createReview, deleteReview};