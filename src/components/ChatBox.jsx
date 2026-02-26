import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBox.css";
import assets from "../assets/assets";
import API from "../services/api"; // ✅ use API instance instead of fetch

const ChatBox = ({
  currentChatUser,
  loggedInUser,
  socket,
  messages,
  setMessages,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const resolveAvatar = (avatar) => {
    if (!avatar) return assets.profile_img;
    if (avatar.startsWith("http")) return avatar;
    return `${import.meta.env.VITE_API_URL}${avatar}`;
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChatUser) return;

      try {
        // ✅ Using API instance instead of fetch
        const res = await API.get(`/messages/${currentChatUser._id}`);
        setMessages(res.data.reverse());
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [currentChatUser, loggedInUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (currentChatUser) {
      socket.emit("typing", {
        senderId: loggedInUser?._id,
        receiverId: currentChatUser._id,
      });
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedImage) || !currentChatUser) return;

    try {
      let savedMessage;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("receiverId", currentChatUser._id);

        // ✅ Use API instance with FormData
        const res = await API.post("/messages/image", formData);
        savedMessage = res.data;
        setSelectedImage(null);
      } else {
        const res = await API.post("/messages", {
          receiverId: currentChatUser._id,
          text: newMessage,
        });
        savedMessage = res.data;
      }

      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
      socket.emit("sendMessage", savedMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      if (currentChatUser && data.sender === currentChatUser._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleTypingEvent = (data) => {
      if (currentChatUser && data.senderId === currentChatUser._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("getMessage", handleMessage);
    socket.on("typing", handleTypingEvent);

    return () => {
      socket.off("getMessage", handleMessage);
      socket.off("typing", handleTypingEvent);
    };
  }, [socket, currentChatUser]);

  return (
    <div className="chat-box">
      <div className="chat-user">
        {currentChatUser ? (
          <>
            <img src={resolveAvatar(currentChatUser.avatar)} alt="" />
            <p>{currentChatUser.name}</p>
            <img
              src={assets.help_icon}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/profile/${currentChatUser._id}`, {
                  state: { user: currentChatUser },
                })
              }
            />
          </>
        ) : (
          <p style={{ padding: "10px" }}>Select a user to start chat</p>
        )}
      </div>

      <div className="chat-msg">
        {messages.map((msg) => {
          const isSender = msg.sender.toString() === loggedInUser?._id;
          const avatarSrc = isSender
            ? resolveAvatar(loggedInUser?.avatar)
            : resolveAvatar(currentChatUser?.avatar);

          return (
            <div
              key={msg._id}
              className={isSender ? "s-msg" : "r-msg"}
              ref={scrollRef}
            >
              {msg.text && <p className="msg">{msg.text}</p>}

              {msg.image && (
                <img
                  className="msg-img"
                  src={`${import.meta.env.VITE_API_URL}${msg.image}`}
                  alt=""
                />
              )}

              <div>
                <img src={avatarSrc} alt="" />
                <p>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && currentChatUser && (
          <p style={{ fontSize: "12px", paddingLeft: "15px", color: "#666" }}>
            {currentChatUser.name} is typing...
          </p>
        )}
      </div>

      {currentChatUser && (
        <div className="chat-input">
          <input
            type="text"
            placeholder="Send a message"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />

          <input
            type="file"
            id="image"
            accept="image/png, image/jpg, image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />

          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Gallery" />
          </label>

          <img src={assets.send_button} alt="Send" onClick={handleSend} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
