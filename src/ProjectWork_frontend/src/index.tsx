import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../assets/main.css";
import ContextWrapper from "./components/ContextWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextWrapper>
      <App />
      <ToastContainer />
    </ContextWrapper>
  </React.StrictMode>
);
