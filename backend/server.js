import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import jwt from "jsonwebtoken"; // Import jwt for token verification
import projectmodal from "./modal/projectmodel.js";
import { generatePrompt } from "./service/aiService.js";
import path from "path";
dotenv.config();

const port = process.env.PORT || 8000;
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this according to your client's origin
    methods: ["GET", "POST"],
  },
});

// Middleware for authentication
io.use(async (socket, next) => {
  try {
    // Extract projectId from handshake query
    const projectId = socket.handshake.query.projectId;

    if (!projectId || !projectId.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error("Invalid or missing projectId");
      error.data = { content: "ProjectId must be a valid MongoDB ObjectId" };
      return next(error);
    }

    // Find the project by ID
    const project = await projectmodal.findById(projectId);
    if (!project) {
      const error = new Error("Project not found");
      error.data = { content: "No project found with the given ID" };
      return next(error);
    }

    socket.project = project; // Attach the project to the socket object

    // Extract token for authentication
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization;
    if (!token) {
      const error = new Error("Authentication error: Token missing");
      error.data = { content: "Please provide a valid token" }; // Additional data can be sent
      return next(error);
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error("Authentication error: Invalid token");
        error.data = { content: "Token verification failed" };
        return next(error);
      }

      // Attach the user info to the socket object for later use
      socket.user = decoded;
      next();
    });
  } catch (error) {
    next(new Error("Internal server error during authentication"));
  }
});

// Connection event
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user?.id}`);
  socket.join(socket.project._id.toString());

  // Handle project-specific messages
  socket.on("project-message", async (data) => {
    const message = data.message;
    const aiIsPresentInMessage = message.includes("@ai");
    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");
      const result = await generatePrompt(prompt);
      io.to(socket.project._id.toString()).emit("project-message", {
        message: result,
        sender: {
          _id: "ai",
          email: "AI",
        },
      });
      return;
    }
    socket.broadcast
      .to(socket.project._id.toString())
      .emit("project-message", data);
  });

  // Handle generic events
  socket.on("event", (data) => {
    console.log("Received event data:", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user?.id}`);
  });
});
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
