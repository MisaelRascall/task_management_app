// Importamos librerías necesarias
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Importamos la función de la API para actualizar un usuario
import { updateUser, getUser } from '../../services/api/usersApi';

export default function EditUserScreen({ route, navigation }) {
  // Extraemos el id del usuario que viene desde UserListScreen
  const { userId } = route.params;

  // Estado para almacenar el nombre del usuario
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect para cargar la información del usuario al montar el componente
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser(userId); // Llamada a la API para obtener los datos del usuario
        setNombre(data.nombre); // Guardamos el nombre en el estado
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        Alert.alert("Error", "No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]); // Se ejecuta solo cuando cambia el userId

  // Función para manejar el envío del formulario
  const handleUpdate = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    try {
      await updateUser(userId, { nombre }); // Llamada a la API para actualizar el usuario
      Alert.alert("Éxito", "Usuario actualizado correctamente");
      navigation.goBack(); // Regresa a la pantalla anterior (UserListScreen)
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del usuario:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="Actualizar usuario" onPress={handleUpdate} />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: 8, 
    marginBottom: 16 
  }
});
