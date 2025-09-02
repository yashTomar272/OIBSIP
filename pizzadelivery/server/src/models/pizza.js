const mongoose=require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String, 
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });


module.exports=mongoose.model("Pizza",pizzaSchema);