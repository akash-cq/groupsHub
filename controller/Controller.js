const { error, timeStamp } = require("console");
const { isAuthenticated, getUser } = require("../middleware/auth");
const User = require("../model/User");
const Group = require("../model/Group");
function handleHome(req, res) {
  res.render("html/index");
}
async function groupCreater(req, res) {
  try {
    const { group_name, group_description, groupType, limit } = req.body;
    const detail = await getUser(req, res);
    console.log(groupType);
    const userId = detail.user_id;
    console.log(userId);
    const adminId = await User.findById(userId);
    console.log(adminId);
    if (!adminId) return res.status(400).json({ msg: "admin not found" });
    const group = new Group({
      name: group_name,
      description: group_description,
      admin: adminId,
      members: [adminId],
      limit: limit,
      group_type: groupType,
    });
    await group.save();

    let obj = {
      groupId: group._id,
      groupname: group_name,
      role: "admin",
    };
    adminId.groups.push(obj);
    await adminId.save();

    return res.status(200).json({ msg: "group created " });
  } catch {
    console.log(error());
    return res.status(500).json({ msg: "error creating group", error });
  }
}
async function userRegisterhandle(req, res) {
  const { user_name, user_email, user_pass } = req.body;
  console.log(user_name);
  if (checkPost(user_name, user_email, user_pass)) {
    try {
      const user = new User({
        name: user_name,
        email: user_email,
        password: user_pass,
      });
      await user.save();
      return res.status(200).json({ msg: "user created" });
    } catch {
      return res.status(500).json({ msg: "error registering user", error });
    }
  } else {
    return res.status(400).json({ msg: "invalid input", data: req.body });
  }
}
function checkPost(name, email, pass) {
  if (!name || !email || !pass || pass.length < 6 || name.length < 4) {
    console.log("error");
    return false;
  } else return true;
}
function handleCreatingGroupPage(req, res) {
  console.log("hi");
  return res.render("html/group_form");
}
async function loginHandle(req, res) {
  const expirationTime = Date.now() + 2000;
  const { email, password } = req.body;
  console.log(email, password, req.body);
  console.log("come");
  try {
    const userInfo = await User.findOne({
      $or: [{ email: email }, { name: email }],
    });
    if (!userInfo)
      return res
        .status(400)
        .json({ msg: "wrong password", msgExpiration: expirationTime });
    const isMatch = password === userInfo.password;
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "wrong password", msgExpiration: expirationTime });
    const obj = {
      user_id: userInfo._id,
      user_name: userInfo.name,
      user_email: userInfo.email,
    };
    req.session.userInfo = obj;
    await req.session.save();
    console.log("done");
    return res
      .status(200)
      .json({ msg: "success", msgExpiration: expirationTime });
  } catch (error) {
    return res.render("html/login", {
      msg: "error internaly",
      msgExpiration: expirationTime,
    });
  }
}
function loginPage(req, res) {
  const expirationTime = Date.now() + 60000;

  res.render("html/login", { msg: "login", msgExpiration: expirationTime });
}
function registartionPage(req, res) {
  res.render("html/registartion");
}
async function regiterUser(req, res) {
  const { name, email, password } = req.body;
  try {
    console.log(req.body);
    const emailExist = await User.findOne({ email: email });
    if (emailExist) return res.status(400).json({ msg: "email" });
    const userExist = await User.findOne({ name: name });
    if (userExist) return res.status(400).json({ msg: "name" });
    if (password.length <= 6) return res.status(400), json({ msg: "pass" });
    const user = new User({
      name: name,
      email: email,
      password: password,
    });
    await user.save();
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    return res.status(400).json({ msg: "error internaly" });
  }
}
async function getdataOfUser(req, res) {
  try {
    const detail = getUser(req, res);
    const userId = detail.user_id;
    const user = await User.findById(userId);
    let groups = [];
    for (const grpsIds of user.groups) {
      console.log(grpsIds.groupId.toString()); // or .toHexString()
      const group = await Group.findById(grpsIds.groupId);
      if (group != null) {
        const join = grpsIds.joined_at;
        let obj = {
          name: group.name,
          description: group.description,
          members: group.members.length,
          joined_at: join,
          last_active_group: group.last_Active,
          groupId:grpsIds.groupId
        };
        groups.push(obj);
      }
    }
    console.log(groups);
    let data = {
      username: user.name,
      email: user.email,
      groups: groups,
      id:user._id
    };
    return res.status(200).json(data);
  } catch {
    return res.status(400).json({ msg: "error internaly" });
  }
}
async function landingShow(req, res) {
  return res.render("html/landingPage");
}
async function Joinpagehandle(req, res) {
  return res.render("html/joingroup");
}
async function groupListData(req, res) {
  try {
    const type = req.params.type;
    let group;
    if (type == "All") group = await Group.find();
    else group = await Group.find({ group_type: type });
    const details = await getUser(req, res);
    console.log(details);
    const userId = details.user_id;
    let data = [];
    for (const grps of group) {
      if (grps != null) {
        console.log("group");
        const joined =
          grps.members.filter(
            (member) => member?._id?.toString() === userId.toString()
          ).length > 0;
          const isAdmin = grps.admin==userId;
        console.log("t/f");
        let obj = {
          groupname: grps.name,
          description: grps.description,
          members: grps.members.length,
          grouptype: grps.group_type,
          group_id: grps._id,
          join: joined,
          adminIs:isAdmin
        };
        data.push(obj);
      }
    }
    console.log(data + "d");
    return res.status(200).json(data);
  } catch {
    return res.status(400).json({ msg: "error internaly" });
  }
}
async function joinGroupHandle(req, res) {
  try {
    const { groupname } = req.body;
    const userDetails = getUser(req, res);
    console.log(userDetails);
    const userId = userDetails.user_id;
    const group = await Group.findOne({ name: groupname });
    if (group.admin == userId || !group)
      return res.status(200).json({ msg: "you are admin of this group" });
    console.log(groupname);
    if (
      group.members.some(
        (member) => member._id.toString() === userId.toString()
      )
    )
      return res.status(200).json({ msg: "you are already" });
    group.members.push(userId);
    await group.save();
    console.log(group + "done");
    const user = await User.findById(userId);
    let obj = {
      groupId: group._id,
      groupname: group.name,
      role: "member",
    };
    console.log(user);
    user.groups.push(obj);
    await user.save();
    return res.status(200).json({ msg: "you have joined the group" });
  } catch {
    console.error();

    return res.status(400).json({ msg: "error internaly" });
  }
}
async function chatPage(req,res) {
  const userId = req.params.userId
  const details = getUser(req,res);
  const userid = details.user_id;
  if(userid!=userId)return res.status(401).json({msg:"not uthorized"});
  return res.render("html/chat");
}
async function Chats(req,res) {
  try{
    const { content, send_at, userid, groupid } = req.body;
    console.log("not error")
    const group = await Group.findById(groupid);
    console.log(req.body,group)
    if(!group)return res.status(401).json({msg:"group not find"});
    const user = getUser(req,res);
    console.log(group.name,user.user_id)
    const isMemeber = group.members.find(users=> users._id==user.user_id)
    console.log(isMemeber)
    if(!isMemeber)return res.status(400).json({msg:"not authorized"});
    const obj={
      sender:user.user_id,
      content:content,
    }
    group.messages.push(obj);
   await group.save();
   console.log("time")
   let data = {
     name: user.user_name,
   };
    return res.status(200).json({msg:"success",data:data})
  }
  catch{
    console.log(error);
    return res.status(500).json({msg:"erro"})
  }
}
module.exports = {
  handleHome,
  groupCreater,
  userRegisterhandle,
  handleCreatingGroupPage,
  loginHandle,
  loginPage,
  registartionPage,
  regiterUser,
  getdataOfUser,
  landingShow,
  Joinpagehandle,
  groupListData,
  joinGroupHandle,
  chatPage,
  Chats,
};
