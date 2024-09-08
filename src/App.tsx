import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import Chat from "./containers/Chat";

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a new UUID for the user
    const newUserId = uuidv4();
    setUserId(newUserId);

    // Optionally, save the userId to localStorage for persistence across page reloads
    localStorage.setItem('chatUserId', newUserId);
  }, []);

  // Don't render the Chat component until we have a userId
  if (!userId) {
    return <div>Loading...</div>;
  }

  return <Chat userId={userId} />;
};

export default App;
