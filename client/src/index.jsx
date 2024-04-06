import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UserPage from "./components/UserPage";
import { EthProvider } from './contexts/EthContext'; 
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route
 } from "react-router-dom";
 
const defaultTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <ThemeProvider theme={defaultTheme}>
      <EthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </Router>
      </EthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
