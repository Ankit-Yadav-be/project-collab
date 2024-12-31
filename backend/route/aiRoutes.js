import express from "express"
import  {getResult}  from "../controller/aiController.js";

const router = express.Router();

router.get("/get-result",getResult);



export default router;