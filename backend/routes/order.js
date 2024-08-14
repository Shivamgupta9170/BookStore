const router = require("express").Router();
const User = require('../models/user');
const authenticateToken = require("../middleware/authenticateToken");
const Order = require("../models/order");

// Place an order
router.post("/placed_order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { orderBooks } = req.body;

        for (const orderData of orderBooks) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderFromDb = await newOrder.save();
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderFromDb._id },
                $pull: { carts: orderData._id } // assuming orderData._id is the cart ID
            });
        }

        return res.json({
            status: "Success",
            msg: "Order placed successfully",
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get order history
router.get("/order_history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" }
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const orderData = userData.orders.reverse();

        return res.json({
            status: "Success",
            msg: "Order history retrieved successfully",
            data: orderData,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all orders (admin)
router.get("/all_orders", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to perform admin work" });
        }

        const userOrders = await Order.find().populate("book").populate("user").sort({ createdAt: -1 });

        return res.json({
            status: "Success",
            msg: "All orders retrieved successfully",
            data: userOrders,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update order status (admin)
router.put("/update_order_status/:orderId", authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { id } = req.headers;
        const { status } = req.body;

        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to perform admin work" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.json({
            status: "Success",
            msg: "Order status updated successfully",
            data: order,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
