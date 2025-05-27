import React, { useState } from "react";
import API from "./api";
import LogoutButton from "./LogoutButton";


function CreateProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    skillsRequired: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const create = async () => {
    try {
      await API.post("/projects", form);
      alert("Projekt dodany!");
      setForm({
        title: "", description: "", startDate: "", endDate: "", location: "", skillsRequired: ""
      });
    } catch {
      alert("Błąd podczas tworzenia projektu");
    }
  };

  return (
    <div>
      <h2>Dodaj nowy projekt</h2>
      <input name="title" placeholder="Tytuł" value={form.title} onChange={handleChange} /><br />
      <textarea name="description" placeholder="Opis" value={form.description} onChange={handleChange} /><br />
      <input name="location" placeholder="Lokalizacja" value={form.location} onChange={handleChange} /><br />
      <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      <input type="date" name="endDate" value={form.endDate} onChange={handleChange} /><br />
      <input name="skillsRequired" placeholder="Wymagane umiejętności" value={form.skillsRequired} onChange={handleChange} /><br />
      <button onClick={create}>Dodaj projekt</button>
    </div>
  );
}

export default CreateProject;
