import * as ai from "../service/aiService.js";

export const getResult = async(req,res)=>{

   try {
    const {prompt}  =req.query;
    const result = await ai.generatePrompt(prompt);
    res.send(result);
   } catch (error) {
       res.status(400).send(error);
   }


}

