const jwt = require("jsonwebtoken");
const JWT_SECRET =process.env.JWT_SECRET;
function tokenSet(req, res, payload) {
      console.log(payload + "asdfg");
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
   res.cookie("jwt", token, {
     httpOnly: true, // Prevents JavaScript from accessing the cookie (security feature)
     secure: true, // Set to true in production (requires HTTPS)
     sameSite: "Strict", // Prevents CSRF attacks
     maxAge: 60 * 60 * 1000, // 1 hour expiration
   });
  return token;
}
function isAuthenticated(req, res,next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const tokens = req.cookies.jwt;
  if (!tokens) {
    return res.status(403).json({ msg: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(tokens, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
}
function getUser(req, res) {
  const token =  req.cookies.jwt;
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded)
  return decoded;
}
module.exports = {tokenSet, isAuthenticated, getUser };
