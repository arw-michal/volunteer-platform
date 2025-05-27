import React, { useEffect, useState } from "react";
import API from "./api";
import LogoutButton from "./LogoutButton";


function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get("/my-applications").then(res => setApps(res.data));
  }, []);

  return (
    <div>
      <h2>Moje zgłoszenia</h2>
      {apps.map(app => (
        <div key={app.Id} style={{ borderBottom: "1px solid #ddd", marginBottom: "10px" }}>
          <h4>{app.Title}</h4>
          <p>Data: {app.StartDate?.slice(0, 10)} – {app.EndDate?.slice(0, 10)}</p>
          <p>Status: {app.Status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyApplications;
