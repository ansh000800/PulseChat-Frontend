import React, { useEffect, useState } from "react";
import "./Chat.css";
import LeftSidebar from "../../components/LeftSidebar";
import ChatBox from "../../components/ChatBox";
import RightSidebar from "../../components/RightSidebar";
import { socket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";

const Chat = ({ loggedInUser, setLoggedInUser }) => {
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // 🔥 Redirect only if user is truly missing
  useEffect(() => {
    if (loggedInUser === null) {
      navigate("/", { replace: true });
    }
  }, [loggedInUser]);

  // 🔥 Connect socket ONLY if user exists
  useEffect(() => {
    if (!loggedInUser) return;

    socket.emit("addUser", loggedInUser._id);

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [loggedInUser]);

  // 🔥 IMPORTANT: Do NOT render until user exists
  if (!loggedInUser) return null;

  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar
          setCurrentChatUser={setCurrentChatUser}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
        <ChatBox
          currentChatUser={currentChatUser}
          loggedInUser={loggedInUser}
          socket={socket}
          messages={messages}
          setMessages={setMessages}
        />
        <RightSidebar
          currentChatUser={currentChatUser}
          loggedInUser={loggedInUser}
          messages={messages}
          setLoggedInUser={setLoggedInUser}
        />
      </div>
    </div>
  );
};

export default Chat;
