const jwt = require("jsonwebtoken");
const booksModel = require("../models/booksModel");



 //==================== [Authentication Middleware]===============================

const Authentication = function (req, res, next) {
    try {
    token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
  
    jwt.verify(token, "group11-project3",function(err,data){
        if(err) return res.status(401).send({status:false, msg:"token is not valid"})
    
    else {req.userdata = data}
    next()
    })
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}

//=================[Authorisation Middleware]============================

const Auth2 = async function (req, res, next) { 
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
        let decodedToken = jwt.verify(token, "group11-project3")
        
        let userToBeModified = req.params.bookId
        console.log(userToBeModified)
 
        let book = await booksModel.findById({_id : userToBeModified}).select({_id:1})
      console.log(book)
      if (Object.keys(book).length==0) {
        return res.status(404).send({ status: false, msg: "No such book exists" });
    }
      console.log(decodedToken) 
        let userLogin = decodedToken.userId
    
        if ( book.userId != userLogin) 
            return res.status(403).send({ status: false, msg: 'You are not authorized.' })
        next()
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

// const mid3 = async function (req,res,next){
//     try {
//         let token = req.headers["x-api-key"]
//         if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
//         let decodedToken = jwt.verify(token, "group11-project3")
//         let userId = req.query.userId
        
//         if ( userId && userId !== decodedToken.userId ) return res.status(400).send({ status: false, msg: "You are not authorized to delete these books. userId doesn't belong to you."})
//         req.userId = decodedToken.userId
//         next()
//     } catch (err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }

// }

module.exports ={Authentication, Auth2} ;