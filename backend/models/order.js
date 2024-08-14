const  mongoose = require("mongoose");

const order = new mongoose.Schema({
    user:
        {
            type:mongoose.Types.ObjectId,
            ref:"user"
        },
    book:
        {
            type:mongoose.Types.ObjectId,
            ref:"book"
        },
    status:
        {
            type:String,
            default:"OrderPlaced",
            enum:["OrderPlaced","Out of Delivery","Delivered","Canceled"]
        },

    
},{timestamps:true});


module.exports = mongoose.model("order",order);