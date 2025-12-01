const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const BASE_URL = `${API_URL}:${API_PORT}`; // IP del proyecto + puerto

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.status}`);
  return await res.json();
}

export async function getUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error(`Error al obtener usuario: ${res.status}`);
  return await res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error al crear usuario: ${res.status}`);
  return await res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error al actualizar usuario: ${res.status}`);
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error al eliminar usuario: ${res.status}`);
  return await res.json();
}