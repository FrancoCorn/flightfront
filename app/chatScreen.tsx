import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { url_ip } from "./(tabs)/schools";
import { AuthContext } from "./context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const ChatScreen = () => {
  const auth = useContext(AuthContext);
  const { username } = useLocalSearchParams();
  const [messages, setMessages] = useState<{ sender__username: string; message: string; timestamp: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigation = useNavigation();

  if (!auth) return null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta la barra de navegación
    });
  }, [navigation]);

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${url_ip}/chat/messages/${username}/`, {
      headers: {
        'Authorization': `Bearer ${auth.userToken}`
      }
    });
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem("userToken");
    await fetch(`${url_ip}/chat/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.userToken}`
      },
      body: JSON.stringify({
        receiver: username,
        message: newMessage,
      }),
    });
    setNewMessage("");
    fetchMessages();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{username}</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{ paddingTop: 80 }} 
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.sender__username === auth.username ? styles.messageContainerSender : styles.messageContainerRecieved}>
            <Text style={styles.sender}>{item.sender__username}:</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Escribe un mensaje..."
        placeholderTextColor="#bbb"
        style={styles.input}
      />
      <Button title="Enviar" onPress={sendMessage} color="#1E90FF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2C37", // Fondo oscuro
    padding: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Asegura que el contenedor esté por encima de otros elementos
  },
  headerBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2C37', // Fondo azul
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    zIndex: 1, // Asegura que el botón esté por encima de otros elementos
  },
  title: { 
    fontSize: 24, 
    color: "#fff",
    textAlign: 'center',
    flex: 1,
  },
  messageContainerRecieved: {
    backgroundColor: "#2B373F", // Fondo del mensaje recibido
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "70%",
  },
  messageContainerSender: {
    backgroundColor: "#2874A6", // Fondo del mensaje enviado
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "70%",
    alignSelf: "flex-end",
  },
  sender: {
    color: "#FFF", // Amarillo para el nombre del usuario
    fontWeight: "bold",
  },
  message: {
    color: "#FFF", // Blanco para el texto del mensaje
  },
  timestamp: {
    color: "#bbb",
    fontSize: 10,
    alignSelf: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444", // Borde gris oscuro
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default ChatScreen;