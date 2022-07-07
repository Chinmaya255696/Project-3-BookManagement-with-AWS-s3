const userModel = require("../models/userModel");
const booksModel = require("../models/booksModel");
const reviewModel = require("../models/reviewModel");

const createBook = async function (req, res) {
    try {
        let data = req.body
        //if body is empty
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Please provide your Book details in body" }) };
        //particular each required feild is mandetory
        if (!data.title || data.title.trim().length == 0) { return res.status(400).send({ status: false, msg: "Title field is required" }) };

        if (!data.excerpt || data.excerpt.trim().length == 0) { return res.status(400).send({ status: false, msg: "Excerpt field is required" }) };

        if (!data.userId || data.userId.trim().length == 0) { return res.status(400).send({ status: false, msg: "UserId field is required" }) };

        if (!data.ISBN || data.ISBN.trim().length == 0) { return res.status(400).send({ status: false, msg: "ISBN field is required" }) };

        if (!data.category || data.category.trim().length == 0) { return res.status(400).send({ status: false, msg: "Category field is required" }) };

        if (!data.subcategory || data.subcategory.length == 0) { return res.status(400).send({ status: false, msg: "Subcategory field is required" }) };

        if (!data.releasedAt || data.releasedAt.length == 0) { return res.status(400).send({ status: false, msg: "releasedAt field is required" }) };

        //title and ISBN is unique or not
        let titleCheck = await booksModel.findOne({ title: data.title });
        if (titleCheck) { return res.status(400).send({ status: false, msg: "Title is already registerd, try anothor" }) };

        let isbnCheck = await booksModel.findOne({ ISBN: data.ISBN });
        if (isbnCheck) { return res.status(400).send({ status: false, msg: "ISBN is already registerd, try anothor" }) };

        if (!(/^.{13,17}$/.test(data.ISBN))) { return res.status(400).send({ status: false, message: "ISBN length should be in between 13 to 17" }) };

        if (!(/^[0-9]+$/.test(data.ISBN))) { return res.status(400).send({ status: false, message: "ISBN should be in Number type" }) };

        if (!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(data.releasedAt))) { return res.status(400).send({ status: false, message: "ReleasedAt format should be in YYYY-MM-DD" }) };

        //objectId valid or not addanother
        let userdata = req.body.userId
        let objectIdCheck = await userModel.findById({ _id: userdata });
        if (!(objectIdCheck)) { return res.status(400).send({ status: false, msg: "UserId is not valid" }) };

        //after checking all validation than create the book
        let saveData = await booksModel.create(data)
        { return res.status(201).send({ status: true, message: "Success", data: saveData }) }
    }
    catch (err) {
        { return res.status(500).send({ status: false, msg: "Error", error: err.message }) }
    }
}

const getBook = async function (req, res) {
    try {

        if (req.query.userId) {
            let userId1 = req.query.userId
            let userIdCheck = await userModel.findById({ _id: userId1 })
            if (!userIdCheck) { return res.status(404).send({ status: false, msg: "userId is not exist" }) }
            let bookData = await booksModel.find({ userId: userIdCheck, isDeleted: false })
            if (bookData.length == 0) { return res.status(404).send({ status: false, msg: "No such Books are found for this userId" }) }
            else { return res.status(200).send({status:true, message:"Books List", data: bookData }) }
        }

        else if (req.query.category) {
            let category = req.query.category
            let categoryCheck = await booksModel.find({ category: category, isDeleted: false })
            if (categoryCheck.length == 0) { return res.status(404).send({ status: false, msg: "No such similar books are find by the category" }) }
            else { return res.status(200).send({status:true, message:"Books List", data: categoryCheck }) };

        } else if (req.query.subcategory) {

            let subcategory = req.query.subcategory
            let subcategoryCheck = await booksModel.find({ subcategory: subcategory, isDeleted: false })
            if (subcategoryCheck.length == 0) { return res.status(404).send({ status: false, msg: "No such similar books are find by the subcategory" }) }
            else { return res.status(200).send({status:true, message:"Books List", data: subcategoryCheck }) };
        } else {
            return res.status(400).send({ status: false, msg: "Please provide the details which you want to see" })
        }
    } catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message });
    }
    // sorting required
};

const getBookById = async function (req, res) {
    try {
        let book_id = req.params.bookId;

        let checkBook = await booksModel.findOne({ _id: book_id, isDeleted: false });

        if (!checkBook)
            return res.status(400).send({ status: false, message: "BookId Not Found" });

        const getReviewsData = await reviewModel.find({ bookId: checkBook._id, isDeleted: false })

        return res.status(200).send({ status: true, message: "Books List", data: getReviewsData });
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

const updateBook = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId
        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: "Incorrect Blog Id format" })
        }

        let book = await booksModel.findById({_id:bookId})
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "No Book Found" })
        }
        // if (req.token.userId != book.userId) {
        //     return res.status(403).send({ status: false, message: "Not Authorised" })
        // }
        if (Object.keys(data).length==0) {
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        };

        let { title, excerpt, releasedAt, ISBN } = data
        if (title) {
            if (!data.title) {
                return res.status(400).send({ status: false, message: "Title is in incorrect format" })
            };
            let checkBook = await booksModel.findOne({ title })
            if (checkBook) {
                return res.status(400).send({ status: false, message: "Title already used" })
            }
        }
        if (excerpt && !data.excerpt) {
            return res.status(400).send({ status: false, message: "excerpt is in incorrect format" })
        };
        // if (ISBN) {
        //     if (!(ISBN)) {
        //         return res.status(400).send({ status: false, message: "ISBN is in incorrect format" })
        //     };
            let checkBook2 = await booksModel.findOne({ ISBN })
            if (checkBook2) {
                return res.status(400).send({ status: false, message: "ISBN already used" })
            }
        // }
        // if (releasedAt) {
        //     if (!data.releasedAt) {
        //         return res.status(400).send({ status: false, message: "releasedAt is required" })
        //     };
        //     if (!data.releasedAt) {
        //         return res.status(400).send({ status: false, message: "releasedAt is in incorrect format (YYYY-MM-DD)" })
        //     }
        // }

        let updatedBook = await booksModel.findOneAndUpdate({ _id: bookId }, { ...req.body }, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: updatedBook })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
};

const deleteBookById = async function (req, res) {
    try {
        let book_id = req.params.bookId;

        let checkBook = await booksModel.findOne({ _id: book_id, isDeleted: false });

        if (!checkBook)
            return res.status(400).send({ status: false, message: "Book is already deleted" });

        const deleteBookData = await booksModel.findOneAndUpdate({ _id: checkBook._id }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, message: "Book is deleted succesfully" });
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

module.exports = { createBook, getBook, getBookById, updateBook, deleteBookById };
