const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const booksController = require("../controller/booksController");
const commnMid = require("../Middleware/auth")
const reviewController = require("../controller/reviewController");

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post("/books", commnMid.Authentication, commnMid.Auth2, booksController.createBook)
router.get('/books', commnMid.Authentication, booksController.getBook)
router.get('/books/:bookId', commnMid.Authentication, booksController.getBookById)
router.put('/books/:bookId', commnMid.Authentication, commnMid.AuthByQuery, booksController.updateBook)

router.delete('/books/:bookId', commnMid.Authentication, commnMid.AuthByQuery, booksController.deleteBookById)
router.post("/books/:bookId/review", reviewController.createReview)





router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})


module.exports = router;