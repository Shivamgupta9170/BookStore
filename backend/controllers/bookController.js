const User = require('../models/user');
const Book = require('../models/book');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const addBook = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Validation errors',
            errors: errors.array()
        });
    }
    try{

        const { id } = req.headers;
        const user = await User.findById(id);
        if(user.role !=="admin"){
            return res.status(400).json({message:"you are not having to perform admin work"});
        }
        const book = new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            description:req.body.description,
            language:req.body.language

        });

        const bookData = await book.save();

    

        res.status(201).json({
            success: true,
            msg: 'book added successfully',
            data: bookData
        });

    }catch(error){
        res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


const updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Validation errors',
            errors: errors.array()
        });
    }
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({ message: "You are not authorized to perform admin work" });
        }

        const {bookid} = req.headers;
        const updateData = req.body;

        const updatedBook = await Book.findByIdAndUpdate(bookid, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            success: true,
            msg: 'Book updated successfully',
            data: updatedBook
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id, bookId } = req.body; // Changed to req.body for better practice
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to perform admin work" });
        }

        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            success: true,
            msg: 'Book deleted successfully',
            data: deletedBook
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message
        });
    }
}

const getBook = async(req,res)=>{
    try{
        const books = await Book.find().sort({created:-1});
        return res.status(200).json({
            success: true,
            msg: 'get All Books',
            data: books
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({success: false , message:"An error occurred"});

    }
}

const getRecentBook = async(req,res)=>{
    try{
        const books = await Book.find().sort({created:-1}).limit(4);
        return res.status(200).json({
            success: true,
            msg: 'get recent 4 Books',
            data: books
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({success: false , message:"An error occurred"});

    }
}




module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getBook,
    getRecentBook
};