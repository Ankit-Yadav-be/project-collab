import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


import { UserProvider } from "./userContext/authContext.jsx";

// Extend the Chakra UI theme (if needed, otherwise skip this part)


createRoot(document.getElementById("root")).render(

    
      <UserProvider>
        <App />
      </UserProvider>
    

);
