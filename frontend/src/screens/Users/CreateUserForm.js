import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { CreateUser } from '../../services/api/usersApi';  // ajusta la ruta según tu estructura

export default function CreateUserForm({ onUserCreated }) {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const newUser = await CreateUser({ nombre });
      // Opcional: notificar al padre / recargar lista
      if (onUserCreated) onUserCreated(newUser);
      Alert.alert('Éxito', `Usuario creado con ID ${newUser.id}`);
      setNombre('');  // limpiar campo
    } catch (err) {
      console.error('Error al crear usuario:', err);
      Alert.alert('Error', 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del usuario:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button
        title={loading ? "Creando..." : "Crear Usuario"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
