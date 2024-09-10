import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Chat.css";
import EmojiPicker from 'emoji-picker-react'; // Add this import

const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:9000", {
  transports: ["websocket"],
});

interface Message {
  id: string;
  userId: string;
  userName: string; // Add this line
  text: string;
  timestamp: number;
  sent?: boolean;
  roomId: string;
  status?: string; // Add this line
}
// ... other imports

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
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

    const handleResize = () => {
      const newViewportHeight = window.innerHeight;
      setViewportHeight(newViewportHeight);

      // Check if keyboard is open
      if (newViewportHeight < viewportHeight) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);
    };
  }, [userId, roomId, name, darkMode, viewportHeight]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

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
    if (window.confirm("Are you sure you want to leave the room?")) {
      socket.emit("leaveRoom", roomId);
      setIsInRoom(false);
      setRoomId("");
      setMessages([]);
    }
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

  const handleInputFocus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleEmojiClick = (emojiObject: any) => {
    setInputMessage(prevInput => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`chatContainer ${darkMode ? "dark-mode" : ""} ${
        isKeyboardOpen ? "keyboard-open" : ""
      }`}
      style={{ height: `${viewportHeight}px` }}
    >
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
        </div>
        <div className="headerRight">
          {isInRoom && (
            <button onClick={leaveRoom} className="leaveButton">
              Leave Room
            </button>
          )}
          {isInRoom && <span className="userName">{name}</span>}
          <button onClick={toggleDarkMode} className="toggleMode">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
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
          <div className="messageList" ref={messageListRef}>
            {messages.map((message, index) => (
              <Message
                key={index}
                text={message.text}
                sender={message.userId === userId ? "me" : message.userName}
                time={new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={(message.sent ? "sent" : message.status) || "pending"}
                userName={message.userName}
              />
            ))}
          </div>
          <div className={"inputArea"}>
            <button 
              className={"attachButton"} 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="emojiPickerContainer">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
                handleTyping();
              }}
              onFocus={handleInputFocus}
              placeholder="Type a message..."
              className={"messageInput"}
            />
            <button onClick={sendMessage} className={"sendButton"}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

const Message = ({
  text,
  sender,
  time,
  status,
  userName,
}: {
  text: string;
  sender: string;
  time: string;
  status: string;
  userName: string;
}) => {
  const getTickClass = () => {
    switch (status) {
      case "sent":
        return "single-tick";
      case "delivered":
        return "double-tick";
      case "read":
        return "blue-tick";
      default:
        return "";
    }
  };

  return (
    <div className={`message ${sender === "me" ? "sent" : "received"}`}>
      {sender !== "me" && <div className="messageSender">{userName}</div>}
      <div className="messageText">{text}</div>
      <div className="messageTime">
        {time}
        {sender === "me" && (
          <span className={`messageStatus tick ${getTickClass()}`}></span>
        )}
      </div>
    </div>
  );
};
