import User from "../modal/usermodel.js";
import Project from "../modal/projectmodel.js";
export const projectController = async (req, res) => {
  try {
    // Extract name from the request body
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    // Extract user email from req.user (populated by authMiddleware)
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    // Find the user in the database by their email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create the project
    const project = new Project({
      name,
      users: [user._id], // Include the user's ID in the users array
    });

    // Save the project to the database
    await project.save();

    // Return the created project
    res.status(201).json({
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);

    if (error.code === 11000) {
      // Handle duplicate name error
      return res.status(400).json({
        message: "Project name already exists. Please choose another name.",
      });
    }

    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getAllProjectController = async (req, res) => {
  try {
    // Step 1: Extract the email from req.user
    const email = req.user?.email;

    if (!email) {
      return res
        .status(400)
        .json({ message: "User email is missing in the request." });
    }

    // Step 2: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Step 3: Use the user ID to find associated projects
    const userId = user._id;
    const projects = await Project.find({ users: userId }).populate(
      "users",
      "name email"
    );

    if (!projects.length) {
      return res
        .status(404)
        .json({ message: "No projects found for this user." });
    }

    // Step 4: Return the list of projects
    res.status(200).json({
      message: "Projects retrieved successfully.",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const addUserToProjectController = async (req, res) => {
  const { projectId, userIds } = req.body; // Extract projectId and userId from the request body
  
  if (!projectId || !userIds) {
    return res.status(400).json({ message: "Project ID and User ID are required." });
  }

  try {
    // Use findOneAndUpdate to add userId to the users array
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, "users": { $ne: userIds } }, // Check if the user is not already in the project
      { $push: { users: userIds } }, // Push the userId to the users array
      { new: true } // Return the updated project document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found or user is already a collaborator." });
    }

    // Return a success message with the updated project
    res.status(200).json({ message: "User added to the project successfully.", project: updatedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const storeAIMessageController = async (req, res) => {
  try {
    const { projectId, message } = req.body; // Assuming projectId and message are passed in the body

    // Find the project by ID
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // If project exists, update the userData with the new AI message
    project.userData = {
      projectId: projectId,
      message: message,
      timestamp: new Date(),
    };

    // Save the project with the updated userData
    await project.save();

    return res.status(200).json({ message: "AI message stored successfully", project });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

 
export  const getAIMessagesController = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project by projectId
    const project = await Project.findById(projectId).select("userData");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Extract the AI messages from userData (assuming it's stored in userData)
    const aiMessages = project.userData.aiMessages || []; // Ensure `aiMessages` exists

    res.status(200).json({ aiMessages });
  } catch (error) {
    console.error("Error fetching AI messages:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};