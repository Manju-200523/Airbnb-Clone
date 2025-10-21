
const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js'); 


module.exports.createReview =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    //if (!listing) {
    //    req.flash("error", "Listing not found");
    //    return res.redirect("/listings");
    //}

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);  // ✅ simpler & safer
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError( 'Listing not found' ,404);
    await Review.findByIdAndDelete(reviewId);
    listing.reviews.pull(reviewId);
    await listing.save();
    req.flash("success", "review deleted");
    res.redirect(req.headers.referer || '/listings');

}