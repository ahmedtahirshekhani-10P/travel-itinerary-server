const express = require("express");
const router = express.Router();

const TripCtrl = require("../controllers/trip");

router.get("", TripCtrl.getTrips);
router.post("", TripCtrl.addNewTrip);
router.get("/:tripname", TripCtrl.getSingleTripDetails);
router.put("/:tripname", TripCtrl.updateTripData);
router.delete("/:tripname", TripCtrl.deleteTrip);
module.exports = router;