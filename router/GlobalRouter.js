const express = require("express");
const GlobalController = require("./../controller/GlobalController");
const AuthController = require("./../controller/AuthController");
const router = express.Router();

// Player X result
router
  .route("/PlayedByX")
  .get(AuthController.protected, GlobalController.getPlayedByMeResult)
  .post(AuthController.protected, GlobalController.postByX);

// Player Y result
// not required
router
  .route("/PlayedByOther")
  .get(GlobalController.getPlayedByOther)
  .post(GlobalController.postByO);

// sending connection request
router
  .route("/SendConnect")
  .post(AuthController.protected, GlobalController.sendRequestToOther);

// accepting request
router
  .route("/acceptRequest")
  .post(AuthController.protected, GlobalController.acceptedSendRequest);

// ending game
router
  .route("/endGame")
  .post(AuthController.protected, GlobalController.endGame);

router.route("/createAccount").post(GlobalController.createPlayerAccount);
router.route("/login").post(AuthController.login);
router.route("/logout").get(AuthController.logout);

module.exports = router;
