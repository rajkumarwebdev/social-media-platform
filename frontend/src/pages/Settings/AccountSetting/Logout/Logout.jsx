import React from "react";
import "./logout.css";
import Button from "../../../../components/Button/Button";
import { NavLink } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("_auth");
    localStorage.removeItem("_user");
    window.location.assign("/login");
  };
  return (
    <div className="logout-container">
      <div>
        <NavLink to={"/settings/accounts"}>
          <Icon icon={faArrowLeft} />
        </NavLink>
      </div>
      <Button className="btn-logout btn-success" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
