const bookModel = require("../models/bookModel")
const userModel=require('../models/userModel')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')


/************************************************Authentication MiddleWare**************************************************/

const authentication = async function (req, res, next) {

    try {

        let token = req.headers["x-api-key"]

        if (!token) return res.status(400).send({ status: false, msg: "No Token Found" })

        let decodedToken = jwt.verify(token, "NONOINWW2Q9NAQO2OQ0#jn$@ono@")

        if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })

        next()

    } catch (err) {

        res.status(500).send({ status: false, Error: err.message })
    }
}