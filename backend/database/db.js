import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Databse conncetion is successful");
  } catch (error) {
    console.log(error);
  }
};

export default connect;
