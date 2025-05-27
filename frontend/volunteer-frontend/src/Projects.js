import React, { useEffect, useState } from "react";
import API from "./api";
import LogoutButton from "./LogoutButton";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data));
  }, []);

  const apply = async (projectId) => {
    try {
      await API.post("/apply", { projectId });
      alert("Zgłoszono do projektu!");
    } catch {
      alert("Błąd podczas zgłoszenia");
    }
  };

  return (
    <div>
      <h2>Dostępne Projekty</h2>
      {projects.map(project => (
        <div key={project.Id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{project.Title}</h3>
          <p>{project.Description}</p>
          <p>Lokalizacja: {project.Location}</p>
          <p>Data: {project.StartDate?.slice(0, 10)} – {project.EndDate?.slice(0, 10)}</p>
          <button onClick={() => apply(project.Id)}>Aplikuj</button>
        </div>
      ))}
    </div>
  );
}

export default Projects;
