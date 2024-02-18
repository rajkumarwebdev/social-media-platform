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
socket.on("typing-event", (status) => {
  const typeElement = document.querySelector(".typing-text");
  typeElement.classList.add("type-show");
  setTimeout(() => {
    typeElement.classList.remove("type-show");
  },800)

});

socket.on("connect", () => {
  socketid = socket.id;
  const senderID = localStorage.getItem("senderid");
  console.log(senderID)
  const receiverID = localStorage.getItem("receiverid");
  socket.emit("id", { socketid: socketid, senderID: senderID, receiverID: receiverID });
})
socket.on("back", (msg) => {

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
  chatCon.appendChild(newMessageCon);
  console.log(msg);

})
const ChatInterface = () => {
  const { uid, name, profile } = useParams();
  const { currentUser } = useProfile();
  const [chatMessage, setChatMessage] = useState("");
  // var [typing, setTyping] = useState(false);

  const [isMessaged, setMessaged] = useState(false);
  // const {webSocket}=useWebSocket();
  const msgConRef = useRef();


  useEffect(() => {

    const receiverID = uid;
    const senderID = JSON.parse(localStorage.getItem("_user")).id;
    console.log(senderID)
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
  }
  const handleTyping = () => {
    const receiverID = uid;
    const senderID = currentUser.id;
    socket.emit("keypress", { socketid: socketid, senderID: senderID, receiverID: receiverID });
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
            onChange={(e) => { setChatMessage(e.target.value); handleTyping() }}

          />

          <Icon icon={faPaperPlane} className={"chatting-btn"} onClick={() => handleChat(chatMessage)} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
