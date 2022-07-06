const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const validator = require("../validator/validator");

const createBook = async function (req, res) {
    try {
        let data = req.body
        //if body is empty
        if (Object.keys(data).length == 0) {
           { return res.status(400).send({ status: false, msg: "Please provide your Book details" })}
        };
        //particular each required feild is mandetory
        if (!data.title) {
            {return res.status(400).send({ status: false, msg: "Title field is required" })}
        };
        if (!data.excerpt) {
           { return res.status(400).send({ status: false, msg: "Excerpt field is required" })}
        };
        if (!data.userId) {
            return res.status(400).send({ status: false, msg: "UserId field is required" })
        };
        if (!data.ISBN) {
            {return res.status(400).send({ status: false, msg: "ISBN field is required" })}
        };
        if (!data.category) {
            {return res.status(400).send({ status: false, msg: "Category field is required" })}
        };
        if (!data.subcategory) {
            {return res.status(400).send({ status: false, msg: "Subcategory field is required" })}
        };
        if (!data.releasedAt) {
            {return res.status(400).send({ status: false, msg: "releasedAt field is required" })}
        };
        //title and ISBN is unique or not
        let titleCheck = await booksModel.findOne({ title: data.title });
        if (titleCheck) {
            {return res.status(400).send({ status: false, msg: "Title is already registerd, try anothor" });}
        };
        let isbnCheck = await booksModel.findOne({ ISBN: data.ISBN });
        if (isbnCheck) {
            { return res.status(400).send({ status: false, msg: "ISBN is already registerd, try anothor" }); }
        };
        if (!(/^.{13,17}$/.test(data.ISBN))) {
            return res.status(400).send({ status: false, message: "ISBN length should be in between 8 to 15" })
        }
        //objectId valid or not addanother
        let data2 = req.body.userId
        let objectIdCheck = await userModel.findById({_id: data2 });
        if (!(objectIdCheck)) {
            { return res.status(400).send({ status: false, msg: "UserId is not valid" }); }
        };
        //create book
        let saveData = await booksModel.create(data)
        {return res.status(201).send({ status: true, message: "Success", data: saveData })}
    }
    catch (err) {
        {return res.status(500).send({ status: false, msg: "Error", error: err.message })}
    }
}
module.exports = { createBook };
