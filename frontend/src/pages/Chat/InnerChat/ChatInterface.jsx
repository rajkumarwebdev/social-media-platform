import React, { useCallback, useEffect, useRef, useState } from "react";
import "./chatinterface.css";
import { Link, useParams } from "react-router-dom";
import Icon from "../../../components/Icon/Icon";
import io from "socket.io-client";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../../hooks/UserContext";
import axiosInstance from "../../../axiosInstance";
import useIpProvider from "../../../hooks/useIpProvider";
var socket = io("http://192.168.25.56:3032");
var socketid = "";

socket.on("typing-event", (status) => {
  const typeElement = document.querySelector(".typing-text");
  if (typeElement != null) {
    typeElement.classList.add("type-show");
    setTimeout(() => {
      typeElement.classList.remove("type-show");
    }, 800);
  }
});

socket.on("connect", () => {
  socketid = socket.id;
  const senderID = localStorage.getItem("senderid");
  console.log(senderID);
  const receiverID = localStorage.getItem("receiverid");

  socket.emit("id", {
    socketid: socketid,
    senderID: senderID,
    receiverID: receiverID,
  });
  //online status code(pending)

  socket.on("client-online", (data) => {
    if (!online_users.includes(data.id)) {
      online_users.push(data.id);
    }
    console.log(data.id + "is online now.");
  });
});

socket.on("back", (msg, data) => {
  const url = new URLSearchParams(location.search);
  console.log(url);

  const chatCon = document.querySelector(".chating-section");
  const newMessageCon = document.createElement("div");
  const newMessageSenderName = document.createElement("div");
  const newMessageContent = document.createElement("div");

  newMessageContent.innerText = msg.message;
  newMessageSenderName.innerText = msg.senderName;
  newMessageSenderName.classList.add("sendername");

  newMessageCon.appendChild(newMessageSenderName);
  newMessageCon.appendChild(newMessageContent);
  newMessageCon.classList.add("sender-message-holder");
  newMessageContent.classList.add("message");
  //For correct destination reach of message.
  if (
    data.receiverid == localStorage.getItem("senderid") &&
    data.senderid == localStorage.getItem("receiverid")
  ) {
    chatCon.appendChild(newMessageCon);
    document.querySelector(".chating-section").scrollTop =
      document.querySelector(".chating-section").scrollHeight;
  }
});

const ChatInterface = () => {
  const { uid, name, profile } = useParams();
  const { currentUser } = useProfile();
  const [userProfile, setUserProfile] = useState("/images/userprofile.png");
  const [chatMessage, setChatMessage] = useState("");
  const msgConRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const ip = useIpProvider();
  const scroll = () => {
    setScrollPosition(document.querySelector(".chating-section").scrollHeight);
  };
  useEffect(() => {
    const pos = (document.querySelector(".chating-section").scrollTop =
      scrollPosition);
  }, [scrollPosition]);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await axiosInstance.post("user/profile", { id: uid });
      console.log(result.data);
      setUserProfile(result.data.response.userProfile);
    };
    fetchUser();
  }, []);
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
    newMessageSenderName.classList.add("yourname");
    newMessageCon.classList.add("your-message-holder");
    newMessageContent.classList.add("message");
    newMessageCon.appendChild(newMessageSenderName);
    newMessageCon.appendChild(newMessageContent);

    setScrollPosition();
    //Message element creation
    const msgText = document.createElement("div");
    msgText.innerText = chatMessage;
    msgText.classList.add("message");
    msgConRef.current.appendChild(newMessageCon);
    // send message to server

    if (chatMessage) {
      const sname = currentUser.name;
      socket.emit("singleChat", {
        senderID: senderID,
        receiverID: receiverID,
        message: chatMessage,
        socketid: socketid,
        senderName: sname,
      });
      //....
      setChatMessage("");
    }
    scroll();
  };
  const handleTyping = (e) => {
    const receiverID = uid;
    const senderID = currentUser.id;
    socket.emit("keypress", {
      socketid: socketid,
      senderID: senderID,
      receiverID: receiverID,
    });
  };
  const handleEnterKey = (e) => {
    if (e.key == "Enter") {
      handleChat(chatMessage);
    }
  };
  return (
    <div className="chat-outer-container">
      <div className="chat-inner-container">
        <div className="chat-ui-header">
          <div className="chat-ui-profile">
            <img
              className="chat-profile-pic"
              src={
                userProfile != "/images/userprofile.png"
                  ? `http://${ip}/images/` + userProfile
                  : currentUser.profilePic
              }
              alt="user-profile"
              width="50px"
            />
            <p className="chat-profile-name">{name}</p>
            {uid != localStorage.getItem("senderid") && (
              <p className="typing-text">Typing...</p>
            )}
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
            onChange={(e) => {
              setChatMessage(e.target.value);
              handleTyping(e.target.value);
            }}
            onKeyDown={(e) => {
              handleEnterKey(e);
            }}
          />

          <Icon
            icon={faPaperPlane}
            className={"chatting-btn"}
            onClick={() => handleChat(chatMessage)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
