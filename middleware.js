const Listing = require('./models/listing.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js'); 
const {reviewSchema } = require('./schema.js'); 
const Review = require('./models/reviews.js'); 

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // ✅ standard name
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};



module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner ");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(error.details.map(el => el.message).join(','), 400));
    }
    next();
};

module.exports. validateReview = (req, res, next) => {
    req.body.review.rating = Number(req.body.review.rating);
    const { error } = reviewSchema.validate({ review: req.body.review });
    if (error) {
        throw new ExpressError( error.details.map(el => el.message).join(','),400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author");
        return res.redirect(`/listings/${id}`);
    }

    next();
};