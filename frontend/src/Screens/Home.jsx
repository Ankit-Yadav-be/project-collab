import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsFetching(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("User is not authenticated.");
          setIsFetching(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/v1/project/allProject",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(response.data.projects || []);
        setIsFetching(false);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to fetch projects.");
        setIsFetching(false);
      }
    };

    fetchProjects();
  }, []);

  // Create Project
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setMessage("Project name is required.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("User is not authenticated.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/project/create",
        { name: projectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((prev) => [...prev, response.data.project]);
      setMessage("Project created successfully!");
      setIsModalOpen(false);
      setProjectName("");
      setIsLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectName("");
    setMessage("");
  };

  const handleProjectClick = (project) => {
    navigate("/project-details", { state: { project } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 to-teal-300 flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-xl rounded-l-xl overflow-hidden flex flex-col">
        {/* Create Project Button */}
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800">Projects</h3>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-teal-600 transition duration-300 flex items-center space-x-2"
          >
            <span>Create</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isFetching ? (
            <p className="text-teal-500">Fetching projects...</p>
          ) : projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li
                  key={project._id}
                  onClick={() => handleProjectClick(project)}
                  className="p-4 bg-gray-50 hover:bg-teal-100 rounded-lg shadow-md cursor-pointer border border-gray-200 flex justify-between items-center transition duration-300"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{project.name}</p>
                    <p className="text-sm text-gray-600">
                      Collaborators: {project.users?.length || 0}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No projects found.</p>
          )}
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Project</h2>
            {message && <p className="text-red-500 mb-2">{message}</p>}
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full px-4 py-2 border rounded-md mb-4 text-gray-700"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex-1 flex justify-center items-center">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
              letterSpacing: '2px',
              padding: '20px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              maxWidth: '80%',
              margin: '0 auto',
            }}
          >
            AI-Powered Collaboration with Ease
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
