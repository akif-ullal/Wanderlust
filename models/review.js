const mongoose = require('mongoose');

const {Schema} = mongoose;

const reviewShema = new Schema(
    {
        comment : String,
        rating : {
            type : Number,
            min : 1,
            max : 5
        },
        createdAt : {
            type :Date,
            default : Date.now()
        },
        author : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }
);


const Review = mongoose.model("Review",reviewShema);
module.exports = Review;