const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const BASE_URL = `${API_URL}:${API_PORT}`; // IP del proyecto + puerto

/** Obtener el estado de una tarea por su id */
export async function getTaskStatus(id) {
  const res = await fetch(`${BASE_URL}/status/${id}`);
  if (!res.ok) throw new Error(`Error al obtener estado: ${res.status}`);
  return await res.json();  // espera { estado: "Pendiente" } o similar
}

/** Actualizar estado de una tarea */
export async function updateTaskStatus(id, nuevoEstado) {
  const res = await fetch(`${BASE_URL}/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  if (!res.ok) throw new Error(`Error al actualizar estado: ${res.status}`);
  return await res.json();  // espera mensaje de éxito o similar
}
