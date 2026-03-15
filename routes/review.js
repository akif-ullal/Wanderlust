const express=require("express");
const router = express.Router({mergeParams : true});
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn,isAuthor,validationReview} = require("../middleware.js");
const reviewController = require("../controller/review.js");



router.post("/",isLoggedIn,validationReview,asyncWrap(reviewController.addNewReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,asyncWrap(reviewController.destroyReview));

module.exports = router;