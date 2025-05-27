const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorize(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Brak tokena autoryzacyjnego");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).send("Brak dostępu");
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).send("Nieprawidłowy token");
    }
  };
}

module.exports = authorize;
