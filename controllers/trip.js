const Trips = require("../models/trips");
const SingleTrip = require("../models/singletrip");
const config = require('../config');


exports.getTrips = async (req, res)=>{
    const user = res.locals.user;
    const resp = await Trips.find({username:user.username});
    if (resp) {
  
      res.send({
        success: true,
        data: resp
      });
    } else {
      res.send({
        success: false,
        error: "Api failed! Error",
      });
    }
  }


  exports.getSingleTripDetails = async (req, res) => {
    const tripName = req.params.tripname
    user = res.locals.user
    const singleTripDetails = await SingleTrip.findOne({username:user.username, tripname:tripName});
    const singleTripMetaData = await Trips.find({username:user.username});
    let obj = {}
    singleTripMetaData.map(val=>{
      if(val.name == tripName){
  
       obj.metaData = val
       obj.singleTripDetails = singleTripDetails
  
      }
    })
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
  await trip.save();

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
    tripdata:tripDays
  });
  await singleTripDetails.save();

  res.send({
    success: true
  })

}

exports.deleteTrip = async (req, res)=>{

  const tripToDel = req.params.tripname
  const user = res.locals.user
  
  const tripDelSuccess = await SingleTrip.deleteOne({username:user.username, tripname:tripToDel});
  await Trips.deleteOne({username:user.username, name:req.params.tripname})
  //console.log(tripMainDet)
  
  if(tripDelSuccess){
    res.send({
      success:true
    })
  }


}

exports.updateTripData = async (req, res)=>{
  const tripToUpd = req.params.tripname
  const {data} = req.body
  const user = res.locals.user
  await SingleTrip.updateOne({username:user.username, tripname:tripToUpd}, {$set:{tripdata: data}})
  res.send({
    success: true
  })

}

