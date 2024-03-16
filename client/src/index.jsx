import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./components/LoginPage";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material";

const defaultTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <ThemeProvider theme={defaultTheme}>
      <LoginPage />
    </ThemeProvider>
  </React.StrictMode>
);
