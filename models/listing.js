const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./reviews.js');
const listingSchema=new Schema({
    title:{
        type :String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location :String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',   
    }],
     geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true // fallback coordinates (London)
        }
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
   
});

listingSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
});
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;





