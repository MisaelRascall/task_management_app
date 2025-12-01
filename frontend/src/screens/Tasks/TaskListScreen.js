import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getTasksByUserName } from '../../services/api/tasksApi';  // ajusta la ruta real si hace falta

export default function TaskListScreen({ route }) {
    const { userName } = route.params || {}; // Leer userId enviado
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await getTasksByUserName(userName); // Todos
                setTasks(res); // Variable response que contiene el arreglo de las tareas filtradas
            } catch (err) {
                console.error("Error al cargar tareas:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        if (userName) fetchTasks();
    }, [userName]);

    if (loading) return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
    );

    if (error) return (
            <View style={styles.center}>
                <Text>Error al cargar tareas</Text>
            </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.title}>{item.titulo}</Text>
                        <Text>{item.descripcion}</Text>
                        <Text>Estado: {item.estado}</Text>
                        <Text>Responsable: {item.responsable}</Text>
                        <Text>Fecha límite: {item.fecha}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No hay tareas</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    taskItem: {
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
