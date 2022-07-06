const mongoose = require("mongoose")
const friendTripsSchema = new mongoose.Schema({
    username:String,
    tripIDs:Array,
    
})

const friendTrips = mongoose.model('friendTrips', UserSchema)
module.exports=User


