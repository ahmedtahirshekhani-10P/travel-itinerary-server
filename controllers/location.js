
const Locations = require("../models/locations");
const config = require('../config');

exports.getSubLoc = async (req, res) => {
    const resp = await Locations.findOne({name:req.params.mainlocationname});
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
  }

exports.getMainLoc = async (req, res) => {
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
  }