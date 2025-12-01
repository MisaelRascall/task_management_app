import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { CreateUser } from '../../services/api/usersApi'; // Importa la función de la API para crear usuarios

export default function CreateUserScreen({ navigation }) {
  const [nombre, setNombre] = useState(''); // Estado local para almacenar el nombre del usuario ingresado

  // Función que se ejecuta al presionar el botón "Guardar"
  const handleSave = async () => {
    if (!nombre.trim()) { // Validación: no permitir campos vacíos
      Alert.alert("Error", "El nombre del usuario es obligatorio");
      return;
    }

    try {
      await CreateUser({ nombre }); // Llamada a la API para crear el usuario
      Alert.alert("Éxito", "Usuario creado correctamente");
      navigation.goBack(); // Regresa a la pantalla anterior (lista de usuarios)
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo crear el usuario");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Usuario:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre} // Actualiza el estado cuando el usuario escribe
        placeholder="Ingresa el nombre"
      />

      <Button title="Guardar" onPress={handleSave} /> {/* Botón que llama a handleSave */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4
  }
});
