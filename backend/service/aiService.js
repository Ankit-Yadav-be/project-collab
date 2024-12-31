import {GoogleGenerativeAI} from "@google/generative-ai"
const genAI = new GoogleGenerativeAI(process.env.Google_AI_KEY);
const model = genAI.getGenerativeModel({
     model: "gemini-1.5-flash" ,
     systemInstruction:`You are an advanced AI model designed to provide helpful, accurate, and relevant responses to user queries. Maintain clarity and conciseness in your answers.
    Respond politely and professionally to all inputs. Use the preferred language of the user unless specified otherwise.
    If you don't have information or the input is ambiguous, seek clarification politely.`
    
    });



export const generatePrompt = async(prompt) =>{
  
    const result = await model.generateContent(prompt);
    return result.response.text();
}