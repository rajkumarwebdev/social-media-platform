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
const STATIC = path.join(path.dirname(__dirname), "frontend", "dist");
app.use(express.static(STATIC));
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

//Socket events & handlers
const io = socketIO(webSoketServer, {
    cors: {
        origin:"*"
    }
});


io.on("connection", (socket) => {
    console.log("An user is connected...");
    socket.on("singleChat", (msg) => {
        console.log(msg); 
        io.emit("back",msg);
    });
  
});


(
    //Server & database config
    async () => {
        try {
            //mongodb server
            await mongoose.connect(process.env.MONGO_DB_URI);
            console.log("Database successfully connected!");
            //http server
            app.listen(process.env.PORT, () => {
                console.log(
                    `Server is running at: http://localhost:${process.env.PORT}`
                );
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
)();

//websocket server
webSoketServer.listen(process.env.SOCKET_PORT, () => {
  console.log(
    `Socket Server is running at: http://localhost:${process.env.SOCKET_PORT}`
  );
});
