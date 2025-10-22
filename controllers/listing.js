const Listing = require('../models/listing.js');
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

module.exports.index =async (req,res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
};

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.showForm=async (req,res)=>{
    const {id}=req.params;
    const listing= await Listing.findById(id).populate({path:'reviews',populate:{
        path:"author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","listing is not available");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};
module.exports.createListing = async (req, res) => {
    try {
        let geoData;
        try {
            geoData = await geocoder.geocode(req.body.listing.location);
            console.log("GeoData returned:", geoData);
        } catch (err) {
            console.log("Geocoder failed, using fallback coordinates", err);
        }

        const newListing = new Listing(req.body.listing);

        // Use geocoded coordinates if available, else fallback
        if (geoData && geoData.length) {
            newListing.geometry = {
                type: "Point",
                coordinates: [geoData[0].longitude, geoData[0].latitude]
            };
        } else {
            // fallback: central coordinates (e.g., Bangalore)
            newListing.geometry = {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            };
        }

        newListing.owner = req.user._id;

        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }

        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");

    } catch (err) {
        console.log("Error in createListing:", err);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("/listings/new");
    }
};


module.exports.editListing=async(req,res)=>{ 
      
    const {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing is not available");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename =req.file.filename; 
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
}