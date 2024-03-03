const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

//Web socket server
const webSoketServer = http.createServer();

//Local Routes imports
const path = require("path");
const registerRoute = require("./routes/register.route.js");
const loginRoute = require("./routes/login.route.js");
const dataRoute = require("./routes/data.route.js");
const postRoute = require("./routes/post.route.js");
const userRoute = require("./routes/user.route.js");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
const STATIC = path.join(path.dirname(__dirname), "frontend", "dist");
// app.use(express.static(STATIC));
app.use(express.static("public"));
//Handle Cross origin requests..
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "POST,GET,DELETE,PUT",
  })
);

//Routes configs
app.use("", registerRoute);
app.use("", loginRoute);
app.use("/api", dataRoute);
app.use("/post", postRoute);
app.use("/user", userRoute);

//test
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: imageStorage,
});
app.post("/upload", upload.single("img"), (req, res) => {
  console.log(req.img);
});

//Socket events & handlers
const io = socketIO(webSoketServer, {
  cors: {
    origin: ["http://localhost:3032", "http://192.168.43.249:3032"],
  },
});

let entries = new Map();
io.on("connection", (socket) => {
  socket.on("online", (data) => {
    socket.broadcast.emit("client-online", { id: data.userId, status: true });
  });
  console.log("An user is connected...");
  socket.on("keypress", (data) => {
    console.log(data);
    if (entries.has(data.receiverID)) {
      socket
        .to(entries.get(data.receiverID))
        .emit("typing-event", { typing: true });
    }
  });
  //handle user diconnect
  socket.on("userlefted", (data) => {
    console.log(data);
    if (data.id != null) {
      console.log("lefted: " + data.id);
    }
  });
  socket.on("id", (msg) => {
    if (msg.socketid) {
      entries.set(msg.senderID, msg.socketid);
    }

    console.log(entries);
    io.emit("totalUsers", { total: entries.size });
  });
  socket.on("singleChat", (msg) => {
    entries.set(msg.senderID, msg.socketid);
    console.log(msg);
    socket.to(entries.get(msg.receiverID)).emit("back", msg, {
      receiverid: msg.receiverID,
      senderid: msg.senderID,
    });
  });
});

//Server & database config
(async () => {
  try {
    //mongodb server
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Database successfully connected!");
    //http server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at: http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    throw new Error(error.message);
  }
})();

//websocket server
webSoketServer.listen(process.env.SOCKET_PORT, () => {
  console.log(
    `Socket Server is running at: http://localhost:${process.env.SOCKET_PORT}`
  );
});
