const controller = require("../controller/Controller");
const midles = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();
router.get("/", controller.landingShow);
router.get("/user/details", controller.getdataOfUser);
router.get("/user/registartion", controller.registartionPage);
router.post("/user/registartion/otp", controller.regiterUserOTP);
router.post("/user/registartion", controller.userRegisterhandle);
router.get("/home", controller.handleHome);
router.get("/user/login", controller.loginPage);
router.get("/user/joingroup", controller.Joinpagehandle);
router.post("/user/login", controller.loginHandle);
router.get(
  "/user/CreategroupPage",
  midles.isAuthenticated,
  controller.handleCreatingGroupPage
);
router.post(
  "/CreategroupPage/creategroup",
  midles.isAuthenticated,
  controller.groupCreater
);
router.get(
  "/user/joingroup/listgroups/:type",
  midles.isAuthenticated,
  controller.groupListData
);

router.post("/user/joingroup/join", controller.joinGroupHandle);
router.post("/user/joingroup/join/rqst", controller.joinGroupHandleRqst);
router.post(
  "/handle-group-request",
  controller.joinGroupHandleAcceptRej
);

router.get("/chats/:groupid/:userId", midles.isAuthenticated, controller.chatPage);
router.post("/user/chats/messagesend", controller.Chats);
router.get("/user/groupchats/getmessage/:groupid",controller.getmsg)
router.use((req, res) => {
  res.redirect("/"); // Redirect to login if route doesn't exist
});
module.exports = router;
