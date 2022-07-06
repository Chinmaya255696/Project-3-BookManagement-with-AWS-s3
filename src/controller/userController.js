const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const validator = require("../validator/validator");

const createUser = async function(req, res){
  try{
    let data = req.body
    let saveData = await userModel.create(data)
    res.status(201).send({status:true, message: "success", data: saveData})
  }
  catch(err){
    res.status(500).send({status:false, msg: "Error", error: err.message})
  }
}
module.exports = {createUser};
