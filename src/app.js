const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservation.routes");
const errorMiddleware = require("./middlewares/error");

const app = express();

// Active CORS pour toutes les origines
app.use(
  cors({
    origin: "*", // autorise toutes les origines (localhost:3000, Render, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware JSON et logger
app.use(express.json());
app.use(morgan("dev"));

// Routes principales
app.use("/auth", authRoutes);
app.use("/catways", catwayRoutes);
app.use("/reservations", reservationRoutes);

// Route racine pour tester rapidement
app.get("/", (req, res) => {
  res.json({
    name: "Russell Marina API",
    docs: "/docs (à implémenter)",
    health: "OK",
  });
});

// Middleware de gestion des erreurs
app.use(errorMiddleware);

module.exports = app;
