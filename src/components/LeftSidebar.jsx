// LeftSidebar.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./LeftSidebar.css";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ setCurrentChatUser, loggedInUser, setLoggedInUser }) => {
  const [users, setUsers] = useState([]);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` },
        });

        const data = await res.json();

        setUsers(data.filter((user) => user._id !== loggedInUser._id));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  // ✅ Real-time search filtering (case insensitive)
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setLoggedInUser(null);
    navigate("/", { replace: true });
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu" onClick={() => setSubmenuOpen(!submenuOpen)}>
            <img src={assets.menu_icon} alt="" />
            {submenuOpen && (
              <div className="sub-menu">
                <p onClick={handleEditProfile}>Edit Profile</p>
                <hr />
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ls-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="friends"
              onClick={() => setCurrentChatUser(user)}
            >
              <img src={user.avatar || assets.profile_img} alt="" />
              <div>
                <p>{user.name}</p>
                <span>{user.bio || "Hey there!"}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: "10px 20px", color: "#c8c8c8" }}>
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
