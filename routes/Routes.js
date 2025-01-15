const controller = require("../controller/Controller");
const midles = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();
router.get("/", controller.landingShow);
router.get("/user/details", midles.isAuthenticated, controller.getdataOfUser);
// router.get("/groups/details/:ids",controller.getGroupinfo)
router.get("/user/registartion", controller.registartionPage);
router.post("/user/registartion", controller.regiterUser);
router.get("/home", midles.isAuthenticated, controller.handleHome);
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
router.post("/user-registration", controller.userRegisterhandle);
router.get(
  "/user/joingroup/listgroups/:type",
  midles.isAuthenticated,
  controller.groupListData
);
router.post("/user/joingroup/join", controller.joinGroupHandle);
router.get("/chats/:groupid/:userId", midles.isAuthenticated, controller.chatPage);
router.post("/user/chats/messagesend", controller.Chats);
router.use((req, res) => {
  res.redirect("/"); // Redirect to login if route doesn't exist
});
module.exports = router;
