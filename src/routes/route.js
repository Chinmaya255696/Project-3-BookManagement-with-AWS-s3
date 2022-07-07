const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const booksController = require("../controller/booksController");

router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.post("/books", booksController.createBook)
router.get('/books',authentication,bookController.getBook)
router.get('/books/:bookId',authentication,bookController.getBookById)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})


module.exports = router;