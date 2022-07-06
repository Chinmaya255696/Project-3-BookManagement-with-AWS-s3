const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const booksController = require("../controller/booksController");

router.post("/register", userController.createUser)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})


module.exports = router;