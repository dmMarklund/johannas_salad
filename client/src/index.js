import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./styles/main.css";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

//Strict mode for better error handling in development

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
