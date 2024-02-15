import React, { useState } from "react";
import "./changepassword.css";
import axiosInstance from "../../../../axiosInstance";
import { NavLink } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import UserProvider, { useProfile } from "../../../../hooks/UserContext";
const ChangePassword = () => {
  const [currentUserPassword, setCurrentUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [newEye, setNewEye] = useState(false);
  const [confirmEye, setConfirmEye] = useState(false);
  const { currentUser}=useProfile()

  const handleEyeConfirm = () => {
    setConfirmEye((prev) => !prev);
  };
  const handleEyeNew = () => {
    setNewEye((prev) => !prev);
  };

  const validateCredentials = (
    currentUserPassword,
    newPassword,
    confirmPassword
  ) => {
    //validation
    let err = {};
    if (currentUserPassword == "") {
      err.currentpass = "You should fill current password!";
    }
    if (newPassword == "") {
      err.newpass = "You should fill new password!";
    }
    if (confirmPassword == "") {
      err.confirmpass = "You should fill confirm password!";
    }
    if (newPassword != confirmPassword) {
      err.nomatch = "Password does not matched!";
    }

    //Check for no keys
    if (Object.keys(err) == 0) {
      setErrors(err);
      return true;
    }
    setErrors(err);
  };
  const changePassword = () => {
    // console.log(currentUserPassword, newPassword, confirmPassword);
    if (
      validateCredentials(currentUserPassword, newPassword, confirmPassword)
    ) {
      const change = async () => {
        console.log(currentUser);
        const response = await axiosInstance.put("/user/changepassword", { userId:currentUser.id ,newpassword:newPassword,currentPass:currentUserPassword});
      };
      change()
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
      </div>
      {errors.currentpass && (
        <div className="error-password-fields">{errors.currentpass}</div>
      )}
      <div className="cp-item cp-item-cn">
        <p className="cp-label">New Password</p>
        <input
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
          className="cp-input"
          type={newEye && newPassword ? "text" : "password"}
        />
        <Icon
          onClick={handleEyeNew}
          className={`eye eye-for-new ${newPassword && "eye-active"}`}
          icon={newEye && newPassword ? faEyeSlash : faEye}
        />
      </div>
      {errors.newpass && (
        <div className="error-password-fields">{errors.newpass}</div>
      )}
      <div className="cp-item cp-item-cnr">
        <p className="cp-label">Confirm Password</p>
        <input
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          className="cp-input"
          type={confirmEye && confirmPassword ? "text" : "password"}
        />
        <Icon
          onClick={handleEyeConfirm}
          className={`eye eye-for-confirm ${confirmPassword && "eye-active"}`}
          icon={confirmEye && confirmPassword ? faEyeSlash : faEye}
        />
      </div>
      {errors.confirmpass && (
        <div className="error-password-fields">{errors.confirmpass}</div>
      )}
      {errors.nomatch && (
        <div className="error-password-fields">{errors.nomatch}</div>
      )}

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
