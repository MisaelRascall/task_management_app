const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const BASE_URL = `${API_URL}:${API_PORT}`; // IP del proyecto + puerto

// Obtener todas las tareas
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error(`Error al obtener tareas: ${res.status}`);
  return await res.json();
}

// Obtener una tarea por ID
export async function getTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  if (!res.ok) throw new Error(`Error al obtener tarea: ${res.status}`);
  return await res.json();
}

// Crear una tarea
export async function createTask({ titulo, descripcion, id_user, fecha }) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion, id_user, fecha })
  });
  if (!res.ok) throw new Error(`Error al crear tarea: ${res.status}`);
  return await res.json();
}

// Buscar tarea por nombre de responsable
export async function getTasksByUserName(userName) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/byUserName?nombre=${encodeURIComponent(userName)}`);
    if (!res.ok) throw new Error(`Error al obtener las tareas: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en la consulta de tareas: ", error);
    throw error;
  }
}

// Actualizar una tarea
export async function updateTask(id, { titulo, descripcion, id_user, fecha }) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion, id_user, fecha })
  });
  if (!res.ok) throw new Error(`Error al actualizar tarea: ${res.status}`);
  return await res.json();
}

// Eliminar una tarea
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error(`Error al eliminar tarea: ${res.status}`);
  return await res.json();
}
