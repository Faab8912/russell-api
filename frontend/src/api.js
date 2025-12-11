const API_BASE_URL = "https://russell-api-mh18.onrender.com";

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Identifiants invalides");
  }

  return await response.json();
}

export async function createReservation({ catwayId, date }) {
  const response = await fetch(
    `${API_BASE_URL}/catways/${catwayId}/reservations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "Client test",
        boatName: "Bateau test",
        startDate: date,
        endDate: date,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la réservation");
  }

  return await response.json();
}
