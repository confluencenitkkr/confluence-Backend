const router = require("express").Router();
const { route } = require(".");
var auth = require("../controller/user.authentication.server.controllers");

// Controllers
var users = require("../controller/users.server.controllers");

// admin pannel
router.route("/login").post(users.signinUser);
router.route("/Signup").post(users.Signup);
router.route("/googleLoginSignup").post(users.googleLoginSignup);

router.route("/searchJobs").get(users.searchEvents);
router.route("/addEvent").post(users.addEvent);
router.route("/addSponsor").post(users.addSponsor);
router.route("/getEvents").get(users.getEvent);
router.route("/getSponsor").get(users.getSponsor);
router.route("/deleteEvent/:id").get(users.deleteEvent);
router.route("/getEvent/:id").get(users.getEventById);
router.route("/editPost/:id").put(users.editPost);

module.exports = router;
