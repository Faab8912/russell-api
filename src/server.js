require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Serveur lancé sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Erreur de connexion à la base :", err.message);
    process.exit(1);
  }
})();
