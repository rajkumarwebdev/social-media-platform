import React, { useRef, useState } from "react";
import "./changepassword.css";
import axiosInstance from "../../../../axiosInstance";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../../../components/Icon/Icon";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../../../hooks/UserContext";
import Loader from "../../../../components/Loader/Loader";
import Alert from "../../../../components/Alert/Alert";
const ChangePassword = () => {
  const navigate = useNavigate()

  const [currentUserPassword, setCurrentUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [newEye, setNewEye] = useState(false);
  const [confirmEye, setConfirmEye] = useState(false);
  const { currentUser } = useProfile();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

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
    if (currentUserPassword.trim() == "") {
      err.currentpass = "You should fill current password!";
    } else if (currentUserPassword.trim().length < 8) {
      err.currentpass = "Minimum 8 character's are required";
    }

    if (newPassword.trim() == "") {
      err.newpass = "You should fill new password!";
    } else if (newPassword.trim().length < 8) {
      err.newpass = "Minimum 8 character's are required";
    }
    if (confirmPassword.trim() == "") {
      err.confirmpass = "You should fill confirm password!";
    } else if (confirmPassword.trim().length < 8) {
      err.confirmpass = "Minimum 8 character's are required";
    }

    if (newPassword.trim() != confirmPassword.trim()) {
      err.nomatch = "Password does not matched!";
    }

    //Check for no keys
    if (Object.keys(err) == 0) {
      setErrors(err);
      return true;
    }
    setErrors(err);
    return false;
  };
  const changePassword = () => {
    // console.log(currentUserPassword, newPassword, confirmPassword);
    if (
      validateCredentials(currentUserPassword, newPassword, confirmPassword)
    ) {
      setLoading(true);

      const change = async () => {
        setConfirmPassword("");
        setNewPassword("");
        try {
          const response = await axiosInstance.put("/user/changepassword", {
            userId: currentUser.id,
            newpassword: newPassword,
            currentPass: currentUserPassword,
          });
          setCurrentUserPassword("");
          setLoading(false);
          setAlert("Password was changed successfull.");
          setTimeout(() => {
            navigate("/settings/accounts/")
          }, 1500)
        } catch (message) {
          const err = {};
          console.log(message);
          if (message.response?.data.error) {
            err.currentpass = message.response?.data.message;
          }
          setErrors(err);
          setLoading(false);
        }
      };
      change();
      setLoading(false);
    }
  };
  return (
    <div className="change-password-container">
      {alert && (
        <Alert varient={"success"} className={alert && "success-change-pass"}>
          {alert}
        </Alert>
      )}
      <div className="cp-item cp-item-cp">
        <p className="cp-label">
          Current Password
        </p>
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
      {loading && <Loader align={"center"} />}
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
