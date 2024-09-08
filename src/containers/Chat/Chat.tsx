import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:9000", { transports: ["websocket"] });

interface Message {
  id: string;
  userId: string;
  userName: string; // Add this line
  text: string;
  timestamp: number;
  sent?: boolean;
  roomId: string;
}

const Chat = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", roomId: "" });
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    socket.on("newMessage", (message: Message) => {
      if (message.roomId === roomId && message.userId !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("messageSent", (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, sent: true } : msg
        )
      );
    });

    socket.on("userTyping", (typingUserId: string, typingRoomId: string) => {
      if (typingUserId !== userId && typingRoomId === roomId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on("joinedRoom", (joinedRoomId: string) => {
      console.log(`Joined room: ${joinedRoomId}`);
      setIsInRoom(true);
      setRoomId(joinedRoomId);
      setUserName(name);
      setMessages([]);
    });

    socket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    return () => {
      socket.off("newMessage");
      socket.off("messageSent");
      socket.off("userTyping");
      socket.off("joinedRoom");
      socket.off("error");
      document.body.classList.remove("dark-mode");
    };
  }, [userId, roomId, name, darkMode]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", roomId: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!roomId.trim()) {
      newErrors.roomId = "Room ID is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const joinRoom = () => {
    if (validateFields()) {
      console.log(`Attempting to join room: ${roomId}`);
      socket.emit("joinRoom", roomId, name, email);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", roomId);
    setIsInRoom(false);
    setRoomId("");
    setMessages([]);
  };

  const sendMessage = () => {
    if (inputMessage.trim() && isInRoom) {
      const newMessage: Message = {
        id: Date.now().toString(),
        userId,
        userName,
        text: inputMessage,
        timestamp: Date.now(),
        sent: false,
        roomId,
      };
      socket.emit("sendMessage", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", userId, roomId);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`chatContainer ${darkMode ? "dark-mode" : ""}`}>
      <div className="chatHeader">
        <div className="userInfo">
          <h2>Group: {isInRoom ? roomId : "Not Connected"}</h2>
          <span className="status">
            {isInRoom
              ? isTyping
                ? "Someone is typing..."
                : `${messages.length} messages`
              : "Offline"}
          </span>
          {name}
        </div>
        <button onClick={toggleDarkMode} className="toggleMode">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      {!isInRoom ? (
        <div className={"joinForm"}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={"formInput"}
          />
          {errors.name && <span className={"error"}>{errors.name}</span>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={"formInput"}
          />
          {errors.email && <span className={"error"}>{errors.email}</span>}
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className={"formInput"}
          />
          {errors.roomId && <span className={"error"}>{errors.roomId}</span>}
          <button onClick={joinRoom} className={"joinButton"}>
            Join Room
          </button>
        </div>
      ) : (
        <div className="chatScreen">
          <div className="messageList">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.userId === userId ? "sent" : "received"
                }`}
              >
                {message.userId !== userId && (
                  <div className="messageSender">{message.userName}</div>
                )}
                <div className="messageText">{message.text}</div>
                <span className="messageTime">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className={"inputArea"}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
                handleTyping();
              }}
              placeholder="Type a message..."
              className={"messageInput"}
            />
            <button onClick={sendMessage} className={"sendButton"}>
              Send
            </button>
          </div>
          <button onClick={leaveRoom} className={"leaveButton"}>
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
