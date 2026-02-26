import React, { useState } from "react";
import "./RightSidebar.css";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({
  currentChatUser,
  loggedInUser,
  messages,
  setLoggedInUser,
}) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const resolveAvatar = (avatar) => {
    if (!avatar) return assets.profile_img;
    if (avatar.startsWith("http")) return avatar;
    return `${import.meta.env.VITE_API_URL}${avatar}`;
  };

  const mediaImages = messages
    ?.filter((msg) => msg.image)
    .map((msg) => `${import.meta.env.VITE_API_URL}${msg.image}`);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setLoggedInUser(null);
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="rs">
        {currentChatUser ? (
          <>
            <div className="rs-profile">
              <img src={resolveAvatar(currentChatUser.avatar)} alt="" />
              <h3>{currentChatUser.name}</h3>
              <p>
                {currentChatUser.bio
                  ? currentChatUser.bio
                  : "Hey there! I am using this chat app."}
              </p>
            </div>

            <hr />

            <div className="rs-media">
              <p>Media</p>
              <div>
                {mediaImages && mediaImages.length > 0 ? (
                  mediaImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() => setSelectedImage(img)}
                      style={{ cursor: "pointer" }}
                    />
                  ))
                ) : (
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    No media shared yet
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rs-profile">
            <p style={{ padding: "20px" }}>Select a user to view profile</p>
          </div>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* 🔥 IMAGE PREVIEW MODAL */}
      {selectedImage && (
        <div className="image-preview-overlay">
          <div className="image-preview-container">
            <button className="back-btn" onClick={() => setSelectedImage(null)}>
              ← Back to Chat
            </button>
            <img src={selectedImage} alt="Preview" />
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
