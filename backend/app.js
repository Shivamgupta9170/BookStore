const express = require('express');
const app = express();
require("dotenv").config();
require("./conn/conn");
const authenticateToken = require("./middleware/authenticateToken");
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));

const userRouts = require("./routes/user");
const adminRoutes = require("./routes/admin");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
app.use("/api",userRouts);
app.use("/api",adminRoutes);
app.use("/api",favouriteRoutes);
app.use("/api",cartRoutes);
app.use("/api",orderRoutes);
app.use('/api', authenticateToken);



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});