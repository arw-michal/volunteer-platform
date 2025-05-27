// src/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return <button onClick={logout}>Wyloguj</button>;
}

export default LogoutButton;
