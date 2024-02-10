import React from "react";
import SetSideBar from "../SetSideBar/SetSideBar";
import Button from "../../../components/Button/Button";
import ChangePassword from "./ChangePassword/ChangePassword";
import { Link } from "react-router-dom";

const AccountSetting = () => {
  const handleLogout = () => {
    localStorage.removeItem("_auth");
    localStorage.removeItem("_user");
    window.location.assign("/login");
  };
  return (
    <>
      <SetSideBar />
      <div className="margin-align">
        {/* <Button className="btn-logout btn-success" onClick={handleLogout}>
          Logout
        </Button> */}
        <Link to={"/settings/accounts/changepassword"}>changepassword</Link>
      </div>
    </>
  );
};

export default AccountSetting;
