import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import MarkDown from "markdown-to-jsx";
import { initializeSocket, recieveMessage, sendMessage } from "../config/socket";
import { useUser } from "../userContext/authContext";

const ProjectDetail = () => {
  const location = useLocation();
  const project = location.state?.project;

  const [projectId, setProjectId] = useState("");
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    initializeSocket(projectId);

    recieveMessage("project-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [projectId]);

  useEffect(() => {
    setProjectId(project?._id);
  }, [location]);

  const toggleSlider = () => {
    setSliderOpen(!isSliderOpen);
  };

  const openModal = () => {
    setModalOpen(true);
    fetchUsers();
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUsers([]);
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/alluser"
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(searchQuery)
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleAddCollaborator = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add as a collaborator.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/project/addusertoproject",
        {
          projectId: projectId,
          userIds: selectedUsers,
        }
      );

      if (response.status === 200) {
        alert("Collaborators added successfully.");
        closeModal();
      }
    } catch (error) {
      console.error("Error adding collaborators:", error.message);
      alert("Failed to add collaborators.");
    }
  };

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prev) => [
      ...prev,
      { message, sender: user, timestamp: new Date().toISOString() },
    ]);
    setMessage("");
  };

  if (!project) {
    return <p className="text-gray-500">No project data available.</p>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Left Section */}
      <div style={{ width: "25%", backgroundColor: "#fff", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(135deg, #f9fafb, #eef2f7)" }}>
  <div style={{ height: "10%", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
    <button
      onClick={openModal}
      style={{
        padding: "12px",
        backgroundColor: "#3182ce",
        borderRadius: "50%",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s",
        color: "#fff",
        fontSize: "18px"
      }}
    >
      <FaUserPlus size={24} />
    </button>
    <button
      onClick={toggleSlider}
      style={{
        padding: "12px",
        backgroundColor: "#3182ce",
        borderRadius: "50%",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s",
        color: "#fff",
        fontSize: "18px"
      }}
    >
      <FaBars size={24} />
    </button>
  </div>

  {/* Messages Section */}
  <div style={{ padding: "20px", height: "80%", overflowY: "auto", borderBottom: "1px solid #ddd", backgroundColor: "#ffffff", borderRadius: "8px" }}>
    <h2
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#2d3748",
        marginBottom: "15px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px",
        borderBottom: "2px solid rgb(172, 179, 176)",
        paddingBottom: "5px",
        backgroundColor: "#f7fafc",
        padding: "10px"
      }}
    >
      Group Chat
    </h2>

    <ul style={{ listStyleType: "none", padding: 0 }}>
      {messages
        .filter((msg) => msg.sender._id !== "ai") // Filter out AI messages here
        .map((msg, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender.email === user.email ? "flex-end" : "flex-start",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                padding: "15px",
                maxWidth: "280px",
                borderRadius: "12px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                backgroundColor: msg.sender.email === user.email ? "#3182ce" : "#edf2f7",
                color: msg.sender.email === user.email ? "#fff" : "#333",
                textAlign: msg.sender.email === user.email ? "right" : "left",
                transition: "background-color 0.3s ease-in-out"
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: msg.sender.email === user.email ? "#fff" : "#2d3748",
                }}
              >
                {msg.sender.email === user.email ? "You" : msg.sender.email}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: msg.sender.email === user.email ? "#fff" : "#4A5568",
                  marginBottom: "8px",
                }}
              >
                {msg.message}
              </p>
              <p style={{ fontSize: "12px", color: "#a0aec0", marginTop: "5px" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </li>
        ))}
    </ul>
  </div>

  {/* Message Input */}
  <div style={{ padding: "20px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", borderTop: "1px solid #ddd", borderRadius: "8px" }}>
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      type="text"
      placeholder="Type your message..."
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        marginRight: "10px",
        fontSize: "14px",
        color: "#333"
      }}
    />
    <button
      onClick={send}
      style={{
        padding: "10px 20px",
        backgroundColor: "#3182ce",
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        fontWeight: "600"
      }}
    >
      Send
    </button>
  </div>
</div>


      {/* Right Section */}
      <div style={{ width: "100%", padding: "20px", backgroundColor: "#f4f4f9" }}>
  <h3
    style={{
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2d3748",
      marginBottom: "20px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      borderBottom: "2px solid rgb(172, 179, 176)",
      paddingBottom: "10px",
    }}
  >
    AI RESPONSE IS SHOWING HERE.....
  </h3>

  <div
    style={{
      width: "75%",
      padding: "20px",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflowY: "auto",
      borderRadius: "10px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      margin: "0 auto",
      background: "linear-gradient(135deg, #d1e2e8 0%, #e9f1f7 100%)", // Adding gradient background
    }}
  >
    {messages
      .filter((msg) => msg.sender._id === "ai") // Only show AI messages here
      .map((msg, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "linear-gradient(145deg, #f0f4f8, #f9fafc)", // Soft background for message box
            transition: "background-color 0.3s ease-in-out",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "#4A5568", // Darker text color for better readability
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            {msg.sender.email === user.email ? "You" : msg.sender.email}
          </p>
          <MarkDown
            style={{
              fontSize: "14px",
              color: "#4A5568", // Match message text color with header for consistency
              lineHeight: "1.6",
              marginBottom: "10px",
            }}
          >
            {msg.message}
          </MarkDown>
          <p
            style={{
              fontSize: "12px",
              color: "#a0aec0", // Lighter color for timestamp to keep focus on content
              marginTop: "5px",
              alignSelf: "flex-end",
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
  </div>
</div>



      {/* Slider for Group Members */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "250px",
          backgroundColor: "#fff",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          transform: isSliderOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s",
          padding: "20px",
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",  borderBottom: "2px solid rgb(172, 179, 176)", paddingBottom: "10px", marginBottom: "10px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Group Members</h3>
          <button onClick={toggleSlider} style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "50%", cursor: "pointer", transition: "all 0.3s" }}>
            <FaTimes size={24} />
          </button>
        </div>
        <ul>
          {project?.users?.map((user, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f7fafc",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                transition: "background-color 0.3s"
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "10px"
                }}
              >
                <span style={{ color: "#4a5568", fontWeight: "bold" }}>
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <span style={{ color: "#2d3748", fontWeight: "500" }}>{user.email}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Collaborator Modal */}
      {isModalOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "400px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#2d3748",
        }}
      >
        Select Collaborators
      </h3>
      <input
        type="text"
        placeholder="Search users"
        onChange={handleSearch}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "20px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      />
      <ul
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          listStyleType: "none",
          padding: 0,
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#3182ce" }}>
            Loading...
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => handleSelectUser(user._id)}
              style={{
                padding: "10px",
                backgroundColor: selectedUsers.includes(user._id) ? "#3182ce" : "#fff",
                color: selectedUsers.includes(user._id) ? "#fff" : "#333",
                cursor: "pointer",
                transition: "background-color 0.3s",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span>{user.email}</span>
            </li>
          ))
        )}
      </ul>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <button
          onClick={closeModal}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e2e8f0",
            color: "#333",
            borderRadius: "8px",
            marginRight: "10px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleAddCollaborator}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3182ce",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ProjectDetail;
