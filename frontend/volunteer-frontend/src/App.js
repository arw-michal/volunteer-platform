import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import MyApplications from "./MyApplications";
import CreateProject from "./CreateProject";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/create-project" element={<CreateProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
