import React, { useState } from "react";
import "./changepassword.css";
import { NavLink } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
const ChangePassword = () => {
  const [currentUserPassword, setCurrentUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const validateCredentials = () => {
    //validation
  };
  const changePassword = () => {
    console.log(currentUserPassword, newPassword, confirmPassword);
    if (validateCredentials()) {
    }
  };
  return (
    <div className="change-password-container">
      <div className="cp-item cp-item-cp">
        <p className="cp-label">Current Password</p>
        <input
          value={currentUserPassword}
          onChange={(e) => {
            setCurrentUserPassword(e.target.value);
          }}
          className="cp-input"
          type="text"
        />
        {errors.current_pass && errors.current_pass}
      </div>
      <div className="cp-item cp-item-cn">
        <p className="cp-label">New Password</p>
        <input
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          className="cp-input"
          type="password"
        />
      </div>
      <div className="cp-item cp-item-cnr">
        <p className="cp-label">Confirm Password</p>
        <input
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          className="cp-input"
          type="password"
        />
      </div>
      <div className="change-password-btn">
        <button
          onClick={changePassword}
          className="change-pass-btn"
          type="button"
        >
          Change Password
        </button>
      </div>
      <div className="nav-to-accounts-page">
        <NavLink to={"/settings/accounts"}>
          <Icon icon={faArrowLeft} className={"nav-ac-btn"} />
        </NavLink>
      </div>
    </div>
  );
};

export default ChangePassword;
