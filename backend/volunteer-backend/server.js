const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const cors = require("cors");
const authorize = require("./authorize");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

sql.connect(config).then(() => console.log("✅ Połączono z bazą danych"))
  .catch(err => console.error("❌ Błąd połączenia z SQL:", err));

// Rejestracja użytkownika
app.post("/register", async (req, res) => {
  const { email, password, role, displayName } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await sql.query`
      INSERT INTO Users (Email, PasswordHash, Role, DisplayName)
      VALUES (${email}, ${hashed}, ${role}, ${displayName})
    `;
    res.status(201).send("Zarejestrowano");
  } catch (err) {
    res.status(400).send("Błąd: " + err.message);
  }
});

// Logowanie użytkownika
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
  const user = result.recordset[0];

  if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
    return res.status(401).send("Nieprawidłowe dane logowania");
  }

  const token = jwt.sign(
    { id: user.Id, email: user.Email, role: user.Role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Start serwera
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});

// Dostęp tylko dla Admina
app.get("/admin-only", authorize("Admin"), (req, res) => {
  res.send("Tylko dla administratorów!");
});

// Dostęp dla każdego zalogowanego (bez względu na rolę)
app.get("/dashboard", authorize(), (req, res) => {
  res.send(`Witaj ${req.user.email}, masz rolę: ${req.user.role}`);
});

app.get("/me", authorize(), (req, res) => {
  console.log("➡️ Żądanie /me – użytkownik:", req.user); // 👈 DODAJ TO!
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
});

app.get("/organizer-dashboard", authorize("Organizer"), (req, res) => {
  res.send("To jest panel organizatora");
});

app.get("/volunteer-dashboard", authorize("Volunteer"), (req, res) => {
  res.send("Witaj, wolontariuszu!");
});

// --- DODAJ PROJEKT (Organizer) ---
app.post("/projects", authorize("Organizer"), async (req, res) => {
  const { title, description, startDate, endDate, location, skillsRequired } = req.body;
  const organizerId = req.user.id;

  try {
    await sql.query`
      INSERT INTO Projects (Title, Description, OrganizerId, StartDate, EndDate, Location, SkillsRequired)
      VALUES (${title}, ${description}, ${organizerId}, ${startDate}, ${endDate}, ${location}, ${skillsRequired})
    `;
    res.status(201).send("Projekt utworzony");
  } catch (err) {
    res.status(400).send("Błąd: " + err.message);
  }
});

// --- POBIERZ WSZYSTKIE PROJEKTY (wszyscy zalogowani) ---
app.get("/projects", authorize(), async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Projects`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Błąd pobierania projektów");
  }
});

// --- ZGŁOŚ SIĘ DO PROJEKTU (Volunteer) ---
app.post("/apply", authorize("Volunteer"), async (req, res) => {
  const { projectId } = req.body;
  const userId = req.user.id;

  try {
    await sql.query`
      INSERT INTO Applications (UserId, ProjectId)
      VALUES (${userId}, ${projectId})
    `;
    res.status(201).send("Zgłoszenie wysłane");
  } catch (err) {
    res.status(400).send("Błąd: " + err.message);
  }
});

// --- POBIERZ MOJE ZGŁOSZENIA (Volunteer) ---
app.get("/my-applications", authorize("Volunteer"), async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await sql.query`
      SELECT A.Id, A.Status, P.Title, P.StartDate, P.EndDate
      FROM Applications A
      JOIN Projects P ON A.ProjectId = P.Id
      WHERE A.UserId = ${userId}
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Błąd pobierania zgłoszeń");
  }
});
