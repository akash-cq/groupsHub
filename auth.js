const jwt = require("jsonwebtoken");
function setUser(user){

    return jwt.sign({
        id
    },"passwordStamp");
}
function  getUser(token){
    if(token)return null;
    jwt.verify(token, "passwordStamp");
}