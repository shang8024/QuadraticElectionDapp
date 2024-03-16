import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "./components/LoginPage";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <h1>User Login Page</h1>
    <LoginPage />
  </React.StrictMode>
);
