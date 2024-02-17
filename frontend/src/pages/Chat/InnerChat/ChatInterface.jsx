import React, { useEffect, useRef, useState } from "react";
import "./chatinterface.css";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../components/Icon/Icon";
import io from "socket.io-client";
import {
  faArrowLeft,

  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../../hooks/UserContext";
var socket = io("http://localhost:3030");

socket.on("back", (msg) => {
  console.log(msg);

});
const ChatInterface = () => {
  const { uid, name, profile } = useParams();
  const { currentUser } = useProfile();
  const [chatMessage, setChatMessage] = useState("");
 
  const [isMessaged, setMessaged] = useState(false);
  // const {webSocket}=useWebSocket();
  const msgConRef = useRef();



  useEffect(() => {
   
  },[isMessaged]);

  const handleChat = (chatMessage) => {
    const receiverID = uid;
    const senderID = currentUser.id;
    //Message element creation
    const msgText = document.createElement("div");
    msgText.innerText = chatMessage;
    msgText.classList.add("message");
    msgConRef.current.appendChild(msgText);
    //send message to server
    socket.emit("singleChat", { senderID: senderID, receiverID: receiverID, message: chatMessage });
        //....
 
        setChatMessage("");
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
            <Link to={"/chat"}>

              <Icon className="chat-ui-profile-action" icon={faArrowLeft} />
            </Link>
          </div>
        </div>
        <div className="chating-section" ref={msgConRef}></div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Type here..."
            value={chatMessage}
            onChange={(e) => { setChatMessage(e.target.value) }}
          />

          <Icon icon={faPaperPlane} className={"chatting-btn"} onClick={()=>handleChat(chatMessage)} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
