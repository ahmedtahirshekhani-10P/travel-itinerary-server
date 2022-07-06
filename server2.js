const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = 3001;
var cors = require("cors");

const mongoose = require("mongoose");

mongoose.Promise = Promise;
mongoose
  .connect("mongodb://localhost:27017/travelitinerary-app")
  .then(console.log("Mongoose Up"));
app.use(bodyParser.json());

const User = require("./models/users");
const Locations = require("./models/locations");
const Trips = require("./models/trips");
const SingleTrip = require("./models/singletrip");

app.use(cors());

// var currentDate = new Date(); //use your date here


Date.prototype.formatMMDDYYYY = function(){
  return (this.getDate()) +
  "-" +  (this.getMonth() + 1) +
  "-" +  this.getFullYear();
}

// var parts =currentDate.formatMMDDYYYY().split("-"),
//     date = new Date(+parts[2], parts[1]-1, +parts[0]);
// console.log(date.toString());



// console.log(currentDate.formatMMDDYYYY().toString())

app.use(
  session({
    secret: "asda2$3w3213askhlkjkldalkl1o8@#",
    saveUninitialized: false,
    resave: false,
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const resp = await User.findOne({ username });
  if (resp) {
    res.send({
      success: false,
      message: "Username already there",
    });
    return;
  }

  const user = new User({
    username,
    password,
  });
  await user.save();
  req.session.username = username;
  req.session.save();
  res.send({
    success: true,
    message: "Registered Successful",
  });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const resp = await User.findOne({ username, password });
  console.log(resp);

  if (resp) {
    req.session.username = username;
    req.session.save();
    res.send({
      success: true,
      message: "Logged in Successful",
    });
  } else {
    res.send({
      success: false,
      message: "Login attempt failed!",
    });
  }
});

app.get("/api/isloggedin", (req, res) => {
  res.json({
    status: !!req.session.username,
  });
});

app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
  });
});

app.get("/api/mainlocations", async (req, res) => {
  const locationArray = [];
  console.log("Api is successful");
  const resp = await Locations.find();
  if (resp) {
    // resp.map((value) => {
    //   locationArray.push(value.name);
    // });
    res.send({
      success: true,
      message: resp,
    });
  } else {
    res.send({
      success: false,
      message: "Api failed! Error",
    });
  }
});


app.post("/api/sublocations", async (req, res) => {
  const {selectedMainLocation} = req.body;
  // console.log(req.body);
  const resp = await Locations.findOne({name:selectedMainLocation});
  // console.log(resp.subPlaces)
  if (resp) {

    res.send({
      success: true,
      message: resp.subPlaces
    });
  } else {
    res.send({
      success: false,
      message: "Api failed! Error",
    });
  }

  // console.log(resp)
});

app.get("/api/mytrips", async (req, res)=>{
  req.session.username = "ahmedtahirshekhani"
  req.session.save()
  const resp = await Trips.findOne({username:req.session.username});
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
})


app.post("/api/mytrips/single", async (req, res) => {
  req.session.username = "ahmedtahirshekhani"
  req.session.save()

  const {tripname: tripName} = req.body;


  const singleTripDetails = await SingleTrip.findOne({username:req.session.username, tripname:tripName});
  const singleTripMetaData = await Trips.findOne({username:req.session.username});
  let obj = {}
  singleTripMetaData.tripdata.map(val=>{
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
});



app.post("/api/updatetrip", async (req, res)=>{
  const {name, data} = req.body
  // const singleTripDetails = await SingleTrip.findOne({username:req.session.username, tripname:name});
  await SingleTrip.updateOne({username:req.session.username, tripname:name}, {$set:{tripdata: data}})
  console.log(data)
  res.send({
    success: true
  })

})

app.post("/api/addnewtrip", async (req, res)=>{
  const parts  = new Date().formatMMDDYYYY()
  req.body.createdOn = parts
  console.log(req.body)

  req.session.username = "ahmedtahirshekhani"
  req.session.save()
  const mytrips = await Trips.findOne({username:req.session.username});
  mytrips.tripdata.push(req.body)
  // console.log(mytrips)
  await Trips.updateOne({username:req.session.username}, {$set:{tripdata: mytrips.tripdata}})
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

})


app.delete("/api/trips/:tripname", async (req, res)=>{
  const tripToDel = req.params.tripname
  const tripDelSuccess = await SingleTrip.deleteOne({username:req.session.username, tripname:tripToDel});
  if(tripDelSuccess){
    res.send({
      success:true
    })
  }


})



