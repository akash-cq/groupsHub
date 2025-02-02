const mailer = require("nodemailer");
var transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "akash.2024dev@gmail.com",
    pass: "wmsvuaaxvjscoknk",
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log("Error in connection: ", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
module.exports = transporter;
