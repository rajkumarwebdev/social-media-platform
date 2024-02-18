import React, { useCallback, useEffect, useRef, useState } from "react";
import "./chatinterface.css";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../components/Icon/Icon";
import io from "socket.io-client";
import {
  faArrowLeft,

  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../../hooks/UserContext";
var socket = io("http://192.168.43.249:3032");
var socketid = "";
var online_user = ""
//onlinestatus

socket.on("totalUsers", (data) => {
  console.log(data.total)
  document.querySelector(".active-users-social-media").innerText ? document.querySelector(".active-users-social-media").innerText = "Active Users :  " + data.total : null
})
socket.on("typing-event", (status) => {
  const typeElement = document.querySelector(".typing-text");
  typeElement.classList.add("type-show");
  setTimeout(() => {
    typeElement.classList.remove("type-show");
  }, 800)

});

socket.on("connect", () => {
  socketid = socket.id;
  const senderID = localStorage.getItem("senderid");
  console.log(senderID)
  const receiverID = localStorage.getItem("receiverid");

  socket.emit("id", { socketid: socketid, senderID: senderID, receiverID: receiverID });
  socket.emit("online", { userId: senderID })

  socket.on("client-online", (data) => {
    online_user = data.id
    console.log(data.id + "is online now.")
  });


})
socket.on("back", (msg, data) => {
  const url = new URLSearchParams(location.search);
  console.log(url)

  const chatCon = document.querySelector(".chating-section");
  const newMessageCon = document.createElement("div");
  const newMessageSenderName = document.createElement("div");
  const newMessageContent = document.createElement("div");

  newMessageContent.innerText = msg.message;
  newMessageSenderName.innerText = msg.senderName;
  newMessageSenderName.classList.add("sendername")

  newMessageCon.appendChild(newMessageSenderName);
  newMessageCon.appendChild(newMessageContent);
  newMessageCon.classList.add("sender-message-holder");
  newMessageContent.classList.add("message");
  //For correct destination reach of message.
  if (data.receiverid == localStorage.getItem("senderid") && data.senderid == localStorage.getItem("receiverid")) {
    chatCon.appendChild(newMessageCon);
    document.querySelector(".chating-section").scrollTop = document.querySelector(".chating-section").scrollHeight;
  }
})
const ChatInterface = () => {
  const { uid, name, profile } = useParams();
  const { currentUser } = useProfile();
  const [chatMessage, setChatMessage] = useState("");
  const msgConRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scroll = () => {
    setScrollPosition(document.querySelector(".chating-section").scrollHeight);
  }
  useEffect(() => {
    const pos = document.querySelector(".chating-section").scrollTop = scrollPosition;
  }, [scrollPosition]);

  useEffect(() => {

    const receiverID = uid;
    const senderID = JSON.parse(localStorage.getItem("_user")).id;

    localStorage.setItem("senderid", senderID);
    localStorage.setItem("receiverid", receiverID);


  }, []);

  const handleChat = (chatMessage) => {
    const receiverID = uid;
    const senderID = currentUser.id;
    const newMessageCon = document.createElement("div");
    const newMessageSenderName = document.createElement("div");
    const newMessageContent = document.createElement("div");
    newMessageContent.innerText = chatMessage;
    newMessageSenderName.innerText = "You";
    newMessageSenderName.classList.add("yourname")
    newMessageCon.classList.add("your-message-holder");
    newMessageContent.classList.add("message");
    newMessageCon.appendChild(newMessageSenderName);
    newMessageCon.appendChild(newMessageContent);

    setScrollPosition()
    //Message element creation
    const msgText = document.createElement("div");
    msgText.innerText = chatMessage;
    msgText.classList.add("message");
    msgConRef.current.appendChild(newMessageCon);
    // send message to server

    if (chatMessage) {
      const sname = currentUser.name;
      socket.emit("singleChat", { senderID: senderID, receiverID: receiverID, message: chatMessage, socketid: socketid, senderName: sname });
      //....
      setChatMessage("");
    }
    scroll()
  }
  const handleTyping = (e) => {

    const receiverID = uid;
    const senderID = currentUser.id;
    socket.emit("keypress", { socketid: socketid, senderID: senderID, receiverID: receiverID });
  }
  const handleEnterKey = (e) => {
    if (e.key == "Enter") {
      handleChat(chatMessage);
    }
  }
  return (
    <div className="chat-outer-container">
      <div className="chat-inner-container">
        <div className="chat-ui-header">
          <div className="chat-ui-profile">
            <img
              className="chat-profile-pic"
              src="/images/userprofile.png"
              alt="user-profile"
              width="50px"
            />
            {online_user==localStorage.getItem("receiverid")?<p>Online</p>:<p>Ofline</p>}
            <p className="chat-profile-name">{name}</p>
            <p className="typing-text">Typing...</p>
            <Link to={"/chat"}>

              <Icon className="chat-ui-profile-action" icon={faArrowLeft} />
            </Link>
          </div>
        </div>
        <div className="chating-section" ref={msgConRef}>

        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Type here..."
            value={chatMessage}
            onChange={(e) => { setChatMessage(e.target.value); handleTyping(e.target.value) }}
            onKeyDown={(e) => { handleEnterKey(e) }}
          />

          <Icon icon={faPaperPlane} className={"chatting-btn"} onClick={() => handleChat(chatMessage)} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
