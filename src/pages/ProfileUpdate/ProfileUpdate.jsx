import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import API from "../../services/api";

const ProfileUpdate = ({ loggedInUser, setLoggedInUser }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const viewingUser = location.state?.user;

  const isViewMode = id && id !== loggedInUser?._id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(assets.avatar_icon);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Prefill Data
  // ===============================
  useEffect(() => {
    if (isViewMode && viewingUser) {
      setName(viewingUser.name || "");
      setEmail(viewingUser.email || "");
      setBio(viewingUser.bio || "");
      setPreview(viewingUser.avatar || assets.avatar_icon);
    } else if (loggedInUser) {
      setName(loggedInUser.name || "");
      setEmail(loggedInUser.email || "");
      setBio(loggedInUser.bio || "");
      setPreview(loggedInUser.avatar || assets.avatar_icon);
    }
  }, [id, viewingUser, loggedInUser]);

  // ===============================
  // Handle Submit (Only Own Profile)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);

      if (image) {
        formData.append("avatar", image);
      }

      const { data } = await API.put("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      const updatedUser = {
        ...data,
        token: data.token || loggedInUser.token,
      };

      setLoggedInUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>

          <label>
            <img src={preview} alt="Profile" />
            {!isViewMode && (
              <>
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                Upload profile image
              </>
            )}
          </label>

          <input
            type="text"
            value={name}
            disabled={isViewMode}
            onChange={(e) => setName(e.target.value)}
          />

          <input type="email" value={email} disabled />

          <textarea
            value={bio}
            disabled={isViewMode}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          <div style={{ display: "flex", gap: "10px" }}>
            {!isViewMode && (
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            )}

            <button type="button" onClick={() => navigate("/chat")}>
              Back to Chat
            </button>
          </div>
        </form>

        <img className="profile-pic" src={preview} alt="Preview" />
      </div>
    </div>
  );
};

export default ProfileUpdate;
