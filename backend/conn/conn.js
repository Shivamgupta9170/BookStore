const mongoose = require("mongoose");

// const URL = "mongodb+srv://shivam9768gupta:lkMzBVWRGaGLUnI7@cluster0.6i9bzx5.mongodb.net/BookStore?retryWrites=true&w=majority";
const URL = process.env.MONGO_URL;
const conn = async ()=>{
    try{
        await mongoose.connect(URL);
        console.log("DataBase connected");
    }catch(error){
        console.log(error);
    }
}

conn();