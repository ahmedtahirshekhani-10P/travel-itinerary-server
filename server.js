const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = 3000;
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

app.use(
  session({
    secret: "asdasd23123helloasdasddasdasdasd2e3234123",
    saveUninitialized: false,
    resave: false,
  })
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/api/register", async (req, res) => {
  const {name, email, username, password } = req.body;
  const resp = await User.findOne({ username, email });
  if (resp) {
    res.send({
      success: false,
      message: "Username already there",
    });
    return;
  }

  const user = new User({
    name,
    email,
    username,
    password
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
  console.log(username, password)
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


app.get("/api/users", async (req, res) => {
  const resp = await User.find({}, {"_id": 0, "username": 1, "email":2});
  // console.log(resp)
  if (resp) {
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
  req.body.createdOn = new Date().toString()
  console.log(req.body)
  
  req.session.username = "ahmedtahirshekhani"
  req.session.save()
  const mytrips = await Trips.findOne({username:req.session.username});
  mytrips.tripdata.push(req.body)
  // console.log(mytrips)
  await Trips.updateOne({username:req.session.username}, {$set:{tripdata: mytrips.tripdata}})
  // console.log(data)
  res.send({
    success: true
  })

})


