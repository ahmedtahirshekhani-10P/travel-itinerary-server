const Trips = require("../models/trips");
const SingleTrip = require("../models/singletrip");
const FriendTrips = require('../models/friendTrips');

const config = require('../config');


exports.getTrips = async (req, res)=>{
    const user = res.locals.user;
    const resp = await Trips.find({username:user.username});
    if (resp) {
  
      res.status(200).send(resp);
    } else {
      return res.status(404).send({errors: [{title: 'Fetch Error!', detail: 'API failed to fetch the data'}]});
    }
  }


  exports.getSingleTripDetails = async (req, res) => {
    const tripId = req.params.tripid
    user = res.locals.user
    //console.log(user.name)
    const singleTripDetails = await SingleTrip.findOne({tId: tripId});
    const singleTripMetaData = await Trips.findOne({_id: tripId});
    //console.log(singleTripDetails, singleTripMetaData)
    let obj = {}
    obj.metaData = singleTripMetaData
    obj.singleTripDetails = singleTripDetails


    // console.log(singleTripDetails)
    if (singleTripDetails) {
  
      res.send({
        success: true,
        message: obj
      });
    } else {
      res.send({
        success: false,
        message: "Api failed! Error",
      });
    }
  
  }


exports.addNewTrip = async (req, res)=>{
  const parts  = new Date().toLocaleDateString("en-GB")
  req.body.createdOn = parts

  req.body.username =res.locals.user.username
  const trip = new Trips(req.body);
  const addedTrip = await trip.save();
  const tripDays = []
  for (let index = 0; index < req.body.days; index++) {
    tripDays.push([
      {numberOfAct: 0},
      []
    ]);
    
  }

  const singleTripDetails = new SingleTrip({
    username:res.locals.user.username,
    tripname:req.body.name,
    tId: addedTrip._id,
    tripdata:tripDays
  });
  await singleTripDetails.save();

  res.send({
    success: true
  })

}

exports.deleteTrip = async (req, res)=>{

  const tripToDel = req.params.tripid

  
  const tripDelSuccess = await SingleTrip.deleteOne({tId:tripToDel});
  await Trips.deleteOne({_id:tripToDel})
  //console.log(tripMainDet)
  
  if(tripDelSuccess){
    res.send({
      success:true
    })
  }


}

exports.updateTripData = async (req, res)=>{
  const tripToUpd = req.params.tripid
  const {data} = req.body
  await SingleTrip.updateOne({tId:tripToUpd}, {$set:{tripdata: data}})
  res.send({
    success: true
  })

}

 //add friend
 exports.addFriend = async (req, res)=>{
  //console.log(req.body.friends)
  //console.log("Here")
  const friendAdded = req.body.friendToAdd
  const tripToUpd = req.params.tripid

  //console.log(tripToUpd, friendAdded)

   await Trips.updateOne({_id: tripToUpd}, {$push:{friends: friendAdded}});

  // Add that trip id to friend Trip table
   await FriendTrips.updateOne({username: friendAdded}, {$push: {"tripIDs": tripToUpd}});
    res.send({
    success: true
  })
}

// Remove Friend
exports.rmvFriend = async (req, res)=>{
  //console.log(req.body.friends)

  const friendDel = req.body.friendToDel
  const tripToUpd = req.params.tripid
  await Trips.updateOne({_id: tripToUpd}, {$pull:{friends: friendDel}});
  await FriendTrips.updateOne({username: friendDel}, {$pull: {"tripIDs": tripToUpd}});
 
  res.send({
    success: true
  })

  
}

exports.getTripsAsFrnd = (req, res) => {
  //console.log("Here")
  const user = res.locals.user;
  
  Trips.find({friends: user.username}, function(err, resp){
    if (err) {
      return res.status(422).send({errors: err.errors});
    }else{
      res.status(200).send(resp)
    }
  })
  
}
