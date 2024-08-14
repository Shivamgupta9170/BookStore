const router = require("express").Router();
const User = require('../models/user');
const Book = require('../models/book');
const authenticateToken = require("../middleware/authenticateToken");

const bookControllers = require("../controllers/bookController");

const { bookValidator, bookUpdateValidator } = require("../helpers/validator");

router.post('/addbook', authenticateToken, bookValidator, bookControllers.addBook);
router.put('/updatebook', authenticateToken, bookUpdateValidator, bookControllers.updateBook);
router.delete('/deletebook', authenticateToken, bookControllers.deleteBook);
router.get('/getbook',bookControllers.getBook);
router.get('/recentBook',bookControllers.getRecentBook);

router.get("/get-book-by-id/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status:"Success",
            data:book
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occured"});
    }
})

module.exports = router;
