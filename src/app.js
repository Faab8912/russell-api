const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const catwayRoutes = require("./routes/catway.routes");
const reservationRoutes = require("./routes/reservation.routes");
const errorMiddleware = require("./middlewares/error");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/catways", catwayRoutes);
app.use("/catways", reservationRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "Russell Marina API",
    docs: "/docs (à implémenter)",
    health: "OK",
  });
});

app.use(errorMiddleware);

module.exports = app;
