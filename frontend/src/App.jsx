import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/Login/Login";
import RequiredAuth from "./components/RequiredAuth/RequiredAuth";
import Settings from "./pages/Settings/Settings";
import CreatePost from "./pages/Post/CreatePost";
import Feeds from "./pages/Feeds/Feeds";
import Profile from "./pages/Profile/Profile";
import Chat from "./pages/Chat/Chat";
import SinglePost from "./pages/SinglePost/SinglePost";
import ChatInterface from "./pages/Chat/InnerChat/ChatInterface";
import SetSideBar from "./pages/Settings/SetSideBar/SetSideBar";
import ThemeSetting from "./pages/Settings/ThemeSetting/ThemeSetting";
import AccountSetting from "./pages/Settings/AccountSetting/AccountSetting";
import SavedPostSetting from "./pages/Settings/SavedPostSetting/SavedPostSetting";
import ChangePassword from "./pages/Settings/AccountSetting/ChangePassword/ChangePassword";
import Logout from "./pages/Settings/AccountSetting/Logout/Logout";
import UpdateProfile from "./pages/Profile/UpdateProfile/UpdateProfile";
const App = () => {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RequiredAuth>
              <Home />
            </RequiredAuth>
          }
        >
          <Route index path="/" element={<Feeds />}></Route>
          <Route index path="/:id" element={<Feeds />}></Route>
          <Route index path="/post/:ids" element={<SinglePost />}></Route>
          <Route index path="/user/:user_Id" element={<Profile />}></Route>

          <Route path="chat" element={<Chat />}></Route>
          <Route
            path="chat/person/:name/:uid"
            element={<ChatInterface />}
          ></Route>
          <Route path="post" element={<CreatePost />}></Route>
          <Route path="profile" element={<Profile />}></Route>

          {/* <Route path="notification" element={<h1>Notification</h1>}></Route> */}
          <Route path="settings" element={<Settings />}></Route>
        </Route>
        <Route path="/settings" element={<Home />}>
          <Route path="theme" element={<ThemeSetting />}></Route>
          <Route path="savedposts" element={<SavedPostSetting />}></Route>
          <Route path="accounts" element={<AccountSetting />}></Route>
          <Route
            path="accounts/changepassword"
            element={<ChangePassword />}
          ></Route>
          <Route
            path="accounts/edit/profile"
            element={<UpdateProfile />}
          ></Route>
          <Route path="accounts/logout" element={<Logout />}></Route>
        </Route>
        <Route
          path="/register"
          element={
            <RequiredAuth>
              <Register />
            </RequiredAuth>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <RequiredAuth>
              <Login />
            </RequiredAuth>
          }
        ></Route>
      </Routes>
    </>
  );
};

export default App;
