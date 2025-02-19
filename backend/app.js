import express from "express";
import connect from "./database/db.js";
import Useroute from "./route/userRoutes.js";
import Projectroute from "./route/projectRoutes.js";
import aiRoutes from "./route/aiRoutes.js";
import cors from "cors";
import path from "path";
const app = express();
connect();
const _dirname = path.resolve();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", Useroute);
app.use("/api/v1/project",Projectroute);
app.use("/api/v1/ai",aiRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
})

export default app;

