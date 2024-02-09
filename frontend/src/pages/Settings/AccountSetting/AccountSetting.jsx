import React from "react";
import SetSideBar from "../SetSideBar/SetSideBar";
import Button from "../../../components/Button/Button";

const AccountSetting = () => {
  const handleLogout = () => {
    localStorage.removeItem("_auth");
    localStorage.removeItem("_user");
      window.location.assign("/login")
      
  };
  return (
    <>
      <SetSideBar />
      <div className="margin-align">
        <Button className="btn-logout btn-success" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default AccountSetting;
