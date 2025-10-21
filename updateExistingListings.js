require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const NodeGeocoder = require('node-geocoder');

const options = { provider: 'openstreetmap' };
const geocoder = NodeGeocoder(options);

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function updateListings() {
    const listings = await Listing.find({ geometry: { $exists: false } });

    for (let listing of listings) {
        try {
            const geoData = await geocoder.geocode(listing.location);
            if (geoData.length) {
                listing.geometry = {
                    type: 'Point',
                    coordinates: [geoData[0].longitude, geoData[0].latitude]
                };
                await listing.save();
                console.log(`Updated: ${listing.title}`);
            } else {
                console.log(`No coordinates found for: ${listing.title}`);
            }
        } catch (err) {
            console.log(`Error for ${listing.title}: `, err);
        }
    }

    console.log('All existing listings updated!');
    mongoose.connection.close();
}

updateListings();
