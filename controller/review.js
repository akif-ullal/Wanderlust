const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addNewReview=async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  let userReview = new Review(req.body.review);
  userReview.author = req.user._id;
  listing.reviews.push(userReview);
  await userReview.save();
  await listing.save();
  req.flash("success","new review is added");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyReview=async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review is deleted");
  res.redirect(`/listing/${id}`);
};