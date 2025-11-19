import React, { useEffect, useState } from "react";
import axios from "axios";
import './ContactMessagesAdmin.scss';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const state = useSelector((state) => state.data);
  const { serverUrl } = useBetween(state.useShareState);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/contactUs`);
        setMessages(res.data);
      } catch (err) {
        alert("Failed to load messages, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [serverUrl]);

  const toggleSelect = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedMessages.length === 0) return;
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/contactUs/delete`, { ids: selectedMessages });
      setMessages(messages.filter((msg) => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
    } catch (err) {
      alert("Failed to delete messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-messages">
      <h1>Contact Messages</h1>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="NoMessage">No messages found.</div>
      ) : (
        <>
          <div className="delete-button-container">
            <button
              className="delete-button"
              disabled={selectedMessages.length === 0 || loading}
              onClick={deleteSelected}
            >
              {loading ? "Deleting..." : <i className="fas fa-trash"></i>}
            </button>
          </div>
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg._id} className="message-card">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(msg._id)}
                    onChange={() => toggleSelect(msg._id)}
                  />
                  <div className="message-info">
                    <p><strong>Name:</strong> {msg.name}</p>
                    <p><strong>Email:</strong> {msg.email}</p>
                    {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
                    <p><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
                    <div className="message-body">
                      <strong>Message:</strong>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>


        </>
      )}
    </div>
  );
};

export default ContactMessagesAdmin;
