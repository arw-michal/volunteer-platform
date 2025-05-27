import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Wysyłam login...");
      const res = await API.post("/login", { email, password });
      console.log("Odpowiedź OK:", res.data);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
       window.location.href = "/dashboard";
      }, 100);

    } catch (err) {
      console.error("Błąd logowania:", err);
      alert("Błąd logowania");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        placeholder="Hasło"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Zaloguj</button>
    </div>
  );
}

export default Login;
