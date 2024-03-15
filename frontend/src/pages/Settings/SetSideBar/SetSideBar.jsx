import React from "react";
import "./setsidebar.css";
import Icon from "../../../components/Icon/Icon";
import { faBookmark, faSun, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
const SetSideBar = () => {
  return (
    <>
      <div className="setsidebar">
        <div className="settings-items">
          {/* <NavLink to={"/settings/theme"} className="setitem theme-item">
            <Icon icon={faSun} />
            <p>Themes</p>
          </NavLink>
          <NavLink
            to="/settings/savedposts"
            className="setitem saved-posts-item"
          >
            <Icon icon={faBookmark} />
            <p>Saved posts</p>
          </NavLink> */}
          <NavLink to="/settings/accounts" className="setitem accounts-item">
            <Icon icon={faUser} />
            <p>Accounts</p>
          </NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default SetSideBar;
