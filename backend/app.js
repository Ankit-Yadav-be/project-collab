import express from "express";
import connect from "./database/db.js";
import Useroute from "./route/userRoutes.js";
import Projectroute from "./route/projectRoutes.js";
import aiRoutes from "./route/aiRoutes.js";
import cors from "cors";
const app = express();
connect();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", Useroute);
app.use("/api/v1/project",Projectroute);
app.use("/api/v1/ai",aiRoutes);


export default app;

