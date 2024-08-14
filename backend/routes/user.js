const router = require("express").Router();

const authenticateToken = require("../middleware/authenticateToken");

const authControllers = require("../controllers/authController");
const bookControlles = require("../controllers/bookController");

const {registerValidator , loginValidator , updateValidator , bookValidator} = require("../helpers/validator");

router.post("/register",registerValidator,authControllers.registerUser);
router.post("/login",loginValidator,authControllers.loginUser);

router.get('/profile', authenticateToken, (req, res) => {

    res.json({
        success: true,
        msg: 'Profile data',
        data: req.user
    });
});

router.put('/updateAddress', authenticateToken, updateValidator, authControllers.updateAddress);


module.exports = router;