const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const { Server } = require("socket.io");

const path = require("path");
const routes = require("./routes/Routes");
const mongo = require("./Connect");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const secret = process.env.SECRET_KEY;
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: secret,
    cookie: {
      httpOnly: true, // Ensure the cookie is only accessible by the server
      secure: false, // Set to true in production if using HTTPS
      sameSite: "strict", // Helps ensure cookies are only sent to your domain
    },
  })
);
mongo();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "view", "css")));
app.use("/js", express.static(path.join(__dirname, "view", "js")));
app.use("/", routes);
const { isAuthenticated, getUser } = require("./middleware/auth");
// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server);
// Listen for incoming connections
const groups = {};
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (token) {
    return next();
  } else {
    next(new Error("Authentication error")); // Reject connection if not authenticated
  }
});
io.on("connection", (socket) => {

  console.log("A user connected");

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(socket);
    socket.broadcast
      .to(groupId)
      .emit("userJoined", { message: "A new user has joined the group!" });
  });
    socket.on("sendMsg", (data) => {
      const groupId = data.groupid;

      io.to(groupId).emit("newMessage", data);
    });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
        // You might want to clean up groups when a user disconnects
        for (const groupId in groups) {
          groups[groupId] = groups[groupId].filter((s) => s !== socket);
        }
      });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
