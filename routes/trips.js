const express = require("express");
const router = express.Router();

const TripCtrl = require("../controllers/trip");
const UserCtrl = require("../controllers/user");

router.get("/",UserCtrl.authMiddleware, TripCtrl.getTrips);
router.post("/", UserCtrl.authMiddleware, TripCtrl.addNewTrip);
router.get("/:tripname",UserCtrl.authMiddleware, TripCtrl.getSingleTripDetails);
router.put("/:tripname",UserCtrl.authMiddleware, TripCtrl.updateTripData);
router.delete("/:tripname",UserCtrl.authMiddleware, TripCtrl.deleteTrip);

//add friend
router.patch("/:tripname",UserCtrl.authMiddleware, TripCtrl.addFriend);

module.exports = router;