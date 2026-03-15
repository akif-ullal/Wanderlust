const mongoose = require('mongoose');
const Reviews = require('./review.js');
const {Schema} = mongoose;

const listingSchema = new Schema(
    {
        title : String,
        description : String,
        image : {
            filename : String,
            url : String,
        },
        price : Number ,
        location : String,
        country : String,
        reviews : [
            {
                type : Schema.Types.ObjectId,
                ref : "Review"
            }
        ],
        owner : 
            {
                type : Schema.Types.ObjectId,
                ref : "User"
            },
        geometry : 
        {
            type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
            },
            coordinates: {
            type: [Number],
            required: true,
            },
        },
    }
);

listingSchema.post("findOneAndDelete",async(listing)=>{
    // console.log(listing);
    if(listing)
    {
       await Reviews.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;