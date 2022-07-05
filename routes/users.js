const express = require("express");
const router = express.Router();

const UserCtrl = require("../controllers/user");

router.post("/register", UserCtrl.registerUser);
router.post("/login", UserCtrl.loginUser);
router.get("/isloggedin", (req, res) => {
  res.json({
    status: !!req.session.username,
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
  });
});
router.get("", UserCtrl.getUsers);

module.exports = router;



