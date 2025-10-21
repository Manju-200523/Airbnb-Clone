const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js'); 
const ExpressError = require('../utils/ExpressError.js');
const reviewController =require("../controllers/review.js");
const {isLoggedIn,isReviewAuthor,validateReview }=require("../middleware.js")




//Reviews
//Post Route for Reviews

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//Delete Route for Reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
