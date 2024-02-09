import React from "react";
import "./chatinterface.css";
import { Link, useParams } from "react-router-dom";
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
  const { uid } = useParams();
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
            <Link to={"/chat"}>
              {" "}
              <Icon className="chat-ui-profile-action" icon={faArrowLeft} />
            </Link>
          </div>
        </div>
        <div className="chating-section">{uid}</div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="say something..."
          />

          <Icon icon={faPaperPlane} className={"chatting-btn"} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
