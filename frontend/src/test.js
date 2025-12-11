console.log("Test lancé depuis test.js");
const API_BASE_URL = "http://localhost:3001";

// Confirmation que le script est bien chargé
console.log("Test lancé depuis test.js");

// Fonction de connexion
async function login({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Réponse login :", data);
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
}

// Fonction de réservation
async function createReservation({ catwayId, date }) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayId}/reservations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      }
    );

    const data = await response.json();
    console.log("Réponse réservation :", data);
  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
  }
}
