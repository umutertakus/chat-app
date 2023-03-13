import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import "../styles/chat.css";

const Chat = ({ room }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "messages");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
      userPhoto: auth.currentUser.photoURL
    });

    setNewMessage("");
  };

  const formatMessageDate = (messageDate) => {
    return new Date(messageDate * 1000).toLocaleString();
  };

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubcsribe = onSnapshot(queryMessages, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubcsribe();
  }, []);

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to {room}</h1>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div className="user-message-container">
            <img
              className="user-photo"
              src={message.userPhoto}
              alt="User Photo"
            />
            <div key={message.id} className="message-container">
              <div className="message">
                <span className="user">{message.user} </span>
                <span className="message-date">
                  {formatMessageDate(message.createdAt?.seconds)}
                </span>
              </div>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          placeholder="Message..."
          className="new-message-input"
          onChange={(event) => setNewMessage(event.target.value)}
          value={newMessage}
        />
        <div className="button-container">
          <button type="submit" className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
