import React, { useEffect, useState } from "react";
import "./chat.css";
import Icon from "../../components/Icon/Icon";
import axiosInstance from "../../axiosInstance";
import {
  faEllipsisVertical,
  faRulerVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import ChatInterface from "./InnerChat/ChatInterface";
import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/UserContext";
import useIpProvider from "../../hooks/useIpProvider";
const Chat = () => {
  const [userProfileName, setUserProfileName] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useProfile();
  const ip = useIpProvider();
  const changeLink = () => { };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/user/allusers")

        const id = await currentUser.id;

        const result = await response.data.filter((user) => user._id != id);

        console.log(result)
        setUsers(result);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();

  }, [])

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
            {
              users.length != 0 ? users.map((user) => {
                return (
                  user._id != currentUser.id && (
                    <Link to={`person/${user.name}/${user._id}?userId=${user._id}`} key={user._id} className="chat-profile" onClick={changeLink}>
                      <img
                        className="chat-profile-pic"
                        src={user.userProfile != "/images/userprofile.png" ? `http://${ip}/images/` + user.userProfile : user.userProfile}
                        alt="user-profile"
                        width="50px"
                      />
                      <Link className="chat-interface-link" >
                        <p className="chat-profile-name">{user.name}</p>
                      </Link>

                      <Icon className="chat-profile-action" icon={faEllipsisVertical} />
                    </Link>
                  )


                )
              }) : (<div className="user-not-found-error">Oops!user not found.please try again later</div>)
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
