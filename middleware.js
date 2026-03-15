const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.userUrl = req.originalUrl;
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }
    next();
};

module.exports.redirectToUserUrl = (req,res,next)=>{
    if(req.session.userUrl)
    {
        res.locals.redirectUrl = req.session.userUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);

    if (!list.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner");
    return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listing/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the owner");
    return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validationList = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);

  if(error)
  {
    next(new ExpressError(404,error.message));
  }else{
    next();
  }
};

module.exports.validationReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);

  if(error)
  {
    next(new ExpressError(404,error.message));
  }else{
    next();
  }
};