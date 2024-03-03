import React from "react";
import SetSideBar from "../SetSideBar/SetSideBar";
import Button from "../../../components/Button/Button";
import ChangePassword from "./ChangePassword/ChangePassword";
import { Link } from "react-router-dom";
import "./accountsetting.css";
const AccountSetting = () => {

  return (
    <>
      <SetSideBar />
      <div className="margin-align accounts-container">
      <Link to={"/settings/accounts/edit/profile"}>UpdateProfile</Link>
        <Link to={"/settings/accounts/changepassword"}>ChangePassword</Link>
        <Link to={"/settings/accounts/logout"}>Logout</Link>
      </div>
    </>
  );
};

export default AccountSetting;
