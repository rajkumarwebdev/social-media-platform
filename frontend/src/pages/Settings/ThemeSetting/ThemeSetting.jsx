import React from "react";
import SetSideBar from "../SetSideBar/SetSideBar";
import "./themesetting.css";
 
import Icon from "../../../components/Icon/Icon";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
const ThemeSetting = () => {
  const handleColorSwitch = () => {};
  return (
    <>
      <SetSideBar />
      <div className="margin-align color">
        <Icon icon={faToggleOff} onClick={handleColorSwitch} />
      </div>
    </>
  );
};

export default ThemeSetting;
