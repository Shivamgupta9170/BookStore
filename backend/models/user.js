const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://www.google.co.in/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffreepng%2Fvector-illustration-of-male-user-profile-icon-with-ui-button-isolated-on-a-white-backgroundstock-image-vector_12220104.html&psig=AOvVaw0CsJMF7wOsjNZjNnZ8qclI&ust=1722037687945000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKjpvL2ww4cDFQAAAAAdAAAAABAE",
  },
  role: { type: String, default:"user", enum: ["admin", "user"] },
  favourites:[{
    type:mongoose.Types.ObjectId,
    ref:"book"
  }],
  carts:[{
    type:mongoose.Types.ObjectId,
    ref:"book"
  }],
  orders:[{
    type:mongoose.Types.ObjectId,
    ref:"order"
  }],

},{timestamps:true});

// Create the User model
const User = mongoose.model("user", userSchema);

module.exports = User;
