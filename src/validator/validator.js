const mongoose = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
  
    if (typeof value === "string" && value.trim().length === 0) return false;
   
    return true;
    
  };
  const isValidTitle = function(title){
    return ['Mr','Mrs','Miss'].includes(title) 
    
   }
  
  const isValidData = function (data) {
    return Object.keys(data).length > 0;
  };

  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };

  module.exports = {isValid,isValidData,isValidTitle, isValidObjectId}