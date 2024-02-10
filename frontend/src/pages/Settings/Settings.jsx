import Button from "../../components/Button/Button";
import InstaButton from "../../components/InstaButton/InstaButton";

import SetSideBar from "./SetSideBar/SetSideBar";
import "./settings.css";
import { Outlet } from "react-router-dom";
const Settings = () => {
  return (
    <div className="settings">
      <SetSideBar />
    
    </div>
  );
};

export default Settings;
