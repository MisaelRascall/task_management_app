import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { getUsers } from '../../services/api/usersApi';  // ajusta la ruta si la tuviste diferente
import { useFocusEffect } from '@react-navigation/native';

export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);        // lista de usuarios
    const [loading, setLoading] = useState(true);  // estado de carga
    const [error, setError] = useState(null);      // para errores

    useFocusEffect(
        React.useCallback(() => {
            fetchUsers();
        }, []) // <-- Aquí van las dependencias si fueran necesarias
    );

    async function fetchUsers() {
        try {
            const res = await getUsers();
            setUsers(res);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) return (
        <View style={styles.center}>
            <Text>Error al cargar usuarios</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Button
                title="Agregar Usuario"
                onPress={() => navigation.navigate('CreateUser')} // pantalla para crear usuario
            />

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userRow}>
                        <TouchableOpacity
                            style={styles.userItem}
                            onPress={() => navigation.navigate('TaskList', { userName: item.nombre })}
                        >
                            <Text style={styles.name}>{item.nombre}</Text>
                        </TouchableOpacity>

                        {/* Botón para modificar usuario */}
                        <Button
                            title="Editar"
                            onPress={() => navigation.navigate('EditUser', {
                                userId: item.id,
                                userName: item.nombre
                            })}
                        />

                        {/* Botón para eliminar usuario */}
                        <Button
                            title="Eliminar"
                            color="red"
                            onPress={() => {
                                // aquí llamaremos la función para eliminar usuario
                                // y luego refrescar la lista
                            }}
                        />
                    </View>
                )}
                ListEmptyComponent={<Text>No hay usuarios</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    userItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    name: { fontSize: 18 }
});
