import React from "react";
import "./chatinterface.css";
import Icon from "../../../components/Icon/Icon";
import {
  faArrowLeft,
  faArrowRight,
  faArrowRotateBack,
  faBackwardFast,
  faBacon,
  faEllipsisVertical,
  faMessage,
  faPaperPlane,
  faRotateBack,
} from "@fortawesome/free-solid-svg-icons";
const ChatInterface = () => {
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
            <p className="chat-profile-name">Rahul</p>
            <Icon className="chat-ui-profile-action" icon={faArrowLeft} />
          </div>
        </div>
        <div className="chating-section">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
          inventore ad quae sed tenetur saepe, tempora recusandae incidunt
          voluptas nemo.
        </div>
        <div className="chat-footer">
          <input type="text" className="chat-input" />
          <Icon icon={faPaperPlane} className={"chatting-btn"} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
