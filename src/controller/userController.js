const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken")

const createUser = async function (req, res) {
  try {
    let data = req.body
    if (!validator.isValidData(data)) {
      return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide User Details", });

    }
    const { title, name, phone, email, password, address } = data;
    if (!validator.isValid(title)) {
      return res.status(400).send({ status: false, message: "Title is required" });

    }

    if (!validator.isValidTitle(title)) {
      return res.status(400).send({ status: false, msg: "Title should be among Mr, Mrs and Miss" })
    }
    if (!validator.isValid(name)) {
      return res.status(400).send({ status: false, message: "User name is required" });

    }
    else if (/\d/.test(name)) {
      return res.status(400).send({ status: false, message: "name cannot have numbers" });

    }

    if (!validator.isValid(phone)) {
      return res.status(400).send({ status: false, message: "Phone Number is required" });

    }
    if (!/^[0-9]\d{9}$/gi.test(phone)) {
      return res.status(400).send({ status: false, message: `provide 10 digits Phone Number` });

    }
    const isPhoneNumberAlreadyUsed = await userModel.findOne({ phone });
    if (isPhoneNumberAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${phone} phone number is already registered` });

    }
    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, message: "Email is required" });

    }
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({ status: false, message: 'Email should be valid email address' });

    }
    const isEmailAlreadyUsed = await userModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, message: "email is already registered" });

    }
    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: "password is required" });

    }
    if (!(/^.{8,15}$/.test(password))) {
      return res.status(400).send({ status: false, message: "password length should be in between 8 to 15" })
    }
    let data1 = req.body.address

    // if (!validator.isValid(address)) {
    //   return res.status(400).send({ status: false, message: "address is required" });
    // }
    // if (Object.keys(data1).length == 0)
    //   return res.status(400).send({ status: false, message: "please provide address details" })

    let saveData = await userModel.create(data)
    res.status(201).send({ status: true, message: 'Success', data: saveData })
  }
  catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message })
  }
}



const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email && !password)
      return res.status(400).send({ status: false, msg: "BAD REQUEST!" });

      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: 'Email should be valid email address' });
  
      }

      if (!(/^.{8,15}$/.test(password))) {
        return res.status(400).send({ status: false, message: "password length should be in between 8 to 15" })
      }

    let user = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, msg: "Email or the Password is not correct" });
    }

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        group: "eleven",
        project: "BookManagement",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      },
      "group11-project3"
    );
    return res.status(201).send({ status: true, data: token });
  } catch (err) {
    console.log("This is the error:", err.message);
    return res.status(500).send({ status: false, msg: err.message });
  }
};


module.exports = { createUser, loginUser };
