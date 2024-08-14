const router = require("express").Router();
const User = require('../models/user');
const authenticateToken = require("../middleware/authenticateToken");


router.put("/add_book_to_fav", authenticateToken, async (req, res) => {
    try {
        const { bookId, id } = req.body;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookId);
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourite" });
        }
        await User.findByIdAndUpdate(id, { $push: { favourites: bookId } });
        res.status(200).json({ message: "Book added to favourites" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/remove_book_to_fav", authenticateToken, async (req, res) => {
    try {
        const { bookId, id } = req.body;
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFavourite = userData.favourites.includes(bookId);
        
        if (isBookFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookId } });
            console.log(`Book ${bookId} removed from user ${id} favourites`);  // Add logging
        } else {
            console.log(`Book ${bookId} is not in user ${id} favourites`);  // Add logging
        }

        res.status(200).json({ message: "Book removed from favourites" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get("/get_book_from_fav", authenticateToken, async (req, res)=>{
    try{
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const FavouriteBooks = userData.favourites;
        
        return res.json({
            status:"Success",
            data:FavouriteBooks,
        })

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;