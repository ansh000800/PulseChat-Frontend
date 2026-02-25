import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setLoggedInUser(JSON.parse(userInfo));
    }
    setAuthChecked(true); // ✅ mark auth as checked
  }, []);

  if (!authChecked) return null; // ✅ wait before rendering routes

  return (
    <Routes>
      <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} />} />
      <Route
        path="/chat"
        element={
          <Chat loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        }
      />
      <Route
        path="/profile"
        element={
          <ProfileUpdate
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        }
      />

      <Route
        path="/profile/:id"
        element={
          <ProfileUpdate
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        }
      />
    </Routes>
  );
};

export default App;
