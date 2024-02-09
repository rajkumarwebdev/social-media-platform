import React, { useState } from "react";
import "./chat.css";
import Icon from "../../components/Icon/Icon";
import {
  faEllipsisVertical,
  faRulerVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import ChatInterface from "./InnerChat/ChatInterface";
import { Link } from "react-router-dom";
const Chat = () => {
  const [userProfileName, setUserProfileName] = useState("");
  const changeLink = () => {};
  return (
    <>
      <div className="chat-outer-container">
        <div className="chat-inner-container">
          <div className="chat-header">
            <input
              className="search-chat-profiles"
              placeholder="Search here."
              type="text"
              value={userProfileName}
              onChange={(e) => {
                setUserProfileName(e.target.value);
              }}
            />
            <Icon className="chat-search-icon" icon={faSearch} />
          </div>
          <div className="chat-profiles">
            <div className="chat-profile" onClick={changeLink}>
              <img
                className="chat-profile-pic"
                src="/images/userprofile.png"
                alt="user-profile"
                width="50px"
              />
              <Link to="person/1">
                <p className="chat-profile-name">Rahul</p>
              </Link>

              <Icon className="chat-profile-action" icon={faEllipsisVertical} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
