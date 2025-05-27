import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/me")
      .then((res) => setUser(res.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {user && (
        <>
          <span style={{ marginRight: "20px" }}>
            Zalogowany jako: <strong>{user.email}</strong> ({user.role})
          </span>

          <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>

          {user.role === "Volunteer" && (
            <>
              <button onClick={() => navigate("/projects")}>📂 Projekty</button>
              <button onClick={() => navigate("/my-applications")}>📝 Moje zgłoszenia</button>
            </>
          )}

          {["Organizer", "Admin"].includes(user.role) && (
            <>
              <button onClick={() => navigate("/projects")}>📂 Projekty</button>
              <button onClick={() => navigate("/create-project")}>➕ Dodaj projekt</button>
            </>
          )}

          {user.role === "Admin" && (
            <button onClick={() => navigate("/admin-panel")}>⚙️ Panel Admina</button>
          )}

          <button onClick={logout} style={{ marginLeft: "20px" }}>
            🚪 Wyloguj
          </button>
        </>
      )}
    </div>
  );
}

export default Navbar;
