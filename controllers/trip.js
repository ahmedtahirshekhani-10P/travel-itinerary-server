const Trips = require("../models/trips");
const SingleTrip = require("../models/singletrip");
const config = require('../config');


exports.getTrips = async (req, res)=>{
    req.session.username = "ahmedtahirshekhani"
    req.session.save()
    const resp = await Trips.find({username:req.session.username});
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
    req.session.username = "ahmedtahirshekhani"
    req.session.save()
  
  
    const singleTripDetails = await SingleTrip.findOne({username:req.session.username, tripname:tripName});
    const singleTripMetaData = await Trips.find({username:req.session.username});
    let obj = {}
    //console.log(singleTripMetaData)
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
  
    // console.log(singleTripDetails)
  }


exports.addNewTrip = async (req, res)=>{
  const parts  = new Date().toLocaleDateString("en-GB")
  req.body.createdOn = parts
  //console.log(req.body)

  req.session.username = "ahmedtahirshekhani"
  req.session.save()
  //const mytrips = await Trips.findOne({username:req.session.username});

  req.body.username =req.session.username
  const trip = new Trips(req.body);
  await trip.save();
  // console.log(mytrips)
  //await Trips.updateOne({username:req.session.username}, {$set:{tripdata: mytrips.tripdata}})
  // console.log(data)

  const tripDays = []
  for (let index = 0; index < req.body.days; index++) {
    tripDays.push([
      {numberOfAct: 0},
      []
    ]);
    
  }

  const singleTripDetails = new SingleTrip({
    username:req.session.username,
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
  
  const tripDelSuccess = await SingleTrip.deleteOne({username:req.session.username, tripname:tripToDel});
  const tripMainDet = await Trips.deleteOne({username:req.session.username, name:req.params.tripname})
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
  // const singleTripDetails = await SingleTrip.findOne({username:req.session.username, tripname:name});
  await SingleTrip.updateOne({username:req.session.username, tripname:tripToUpd}, {$set:{tripdata: data}})
  //console.log(data)
  res.send({
    success: true
  })

}

