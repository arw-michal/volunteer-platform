import React, { useEffect, useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard: próbuję pobrać dane użytkownika...");

    API.get("/me")
      .then(res => {
        console.log("Dane użytkownika:", res.data);
        setUser(res.data);
        switch (res.data.role) {
          case "Volunteer":
            navigate("/projects");
            break;
          case "Organizer":
            navigate("/create-project");
            break;
          case "Admin":
            alert("Zalogowano jako Admin");
            break;
          default:
            navigate("/");
        }
      })
      .catch((err) => {
        console.error("Błąd API /me:", err);
        alert("Brak dostępu – zaloguj się");
        navigate("/");
      });
  }, [navigate]);

  return <div>Trwa przekierowanie dla {user?.email}...</div>;
}

export default Dashboard;
