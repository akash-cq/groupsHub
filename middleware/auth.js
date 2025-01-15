function isAuthenticated(req, res, next) {
  if (req.session.userInfo) {
    return next();
  }
  return res.redirect("/user/login");
}
function getUser(req,res){
  return req.session.userInfo;
}
module.exports = { isAuthenticated, getUser };