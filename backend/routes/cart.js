const router = require("express").Router();
const User = require('../models/user');
const authenticateToken = require("../middleware/authenticateToken");


router.put("/add_book_to_cart", authenticateToken, async (req, res) => {
    try {
        const { bookId, id } = req.body;
        const userData = await User.findById(id);
        const isBookInCart = userData.carts.includes(bookId);
        if (isBookInCart) {
            return res.status(200).json({ message: "Book is already in carts" });
        }
        await User.findByIdAndUpdate(id, { $push: { carts: bookId } });
        res.status(200).json({ message: "Book added to carts" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.put("/remove_book_to_cart", authenticateToken, async (req, res) => {
    try {
        const { bookId, id } = req.body;
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookInCart = userData.carts.includes(bookId);
        
        if (isBookInCart) {
            await User.findByIdAndUpdate(id, { $pull: { carts: bookId } });
            console.log(`Book ${bookId} removed from user ${id} carts`);  // Add logging
        } else {
            console.log(`Book ${bookId} is not in user ${id} carts`);  // Add logging
        }

        res.status(200).json({ message: "Book removed from carts" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/get_book_from_cart", authenticateToken, async (req, res)=>{
    try{
        const { id } = req.headers;
        const userData = await User.findById(id).populate("carts");
        const cartBooks = userData.carts;
        
        return res.json({
            status:"Success",
            data:cartBooks,
        })

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;

