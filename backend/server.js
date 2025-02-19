import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import jwt from "jsonwebtoken";
import projectmodal from "./modal/projectmodel.js";
import { generatePrompt } from "./service/aiService.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 8000;
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for authentication
io.use(async (socket, next) => {
  try {
    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project ID"));
    }

    const project = await projectmodal.findById(projectId);
    if (!project) {
      return next(new Error("Project not found"));
    }

    socket.project = project;

    let token = socket.handshake.auth.token || socket.handshake.headers.authorization;
    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract only the token
    }

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
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

  socket.on("project-message", async (data) => {
    handleAIMessage(socket, data);
  });

  socket.on("event", (data) => {
    console.log("Received event data:", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user?.id}`);
  });
});

// Separate function for AI handling to avoid blocking the event loop
async function handleAIMessage(socket, data) {
  const message = data.message;
  if (message.includes("@ai")) {
    const prompt = message.replace("@ai", "");
    try {
      const result = await generatePrompt(prompt);
      io.to(socket.project._id.toString()).emit("project-message", {
        message: result,
        sender: {
          _id: "ai",
          email: "AI",
        },
      });
    } catch (err) {
      console.error("AI Processing Error:", err);
    }
    return;
  }
  socket.broadcast.to(socket.project._id.toString()).emit("project-message", data);
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
