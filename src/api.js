// URL de ton backend déployé sur Render
export const API_BASE_URL = "https://russell-api-mh18.onrender.com";

// Fonction générique pour appeler l’API
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token"); // récupère le token si tu l’as stocké
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur API");
  return data;
}

// Exemple d’appel GET
export async function getCatways() {
  return apiFetch("/catways");
}

// Exemple d’appel POST (connexion)
export async function login(credentials) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Exemple d’appel POST (réservation)
export async function createReservation(reservationData) {
  return apiFetch("/reservations", {
    method: "POST",
    body: JSON.stringify(reservationData),
  });
}
