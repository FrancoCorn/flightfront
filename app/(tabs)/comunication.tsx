import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { url_ip } from "./schools";
import { AuthContext } from "../context/AuthContext";
const receiverUsername = "Hola";
const ChatScreen = () => {
  const auth = useContext(AuthContext);
  const [messages, setMessages] = useState<{ sender__username: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  if (!auth) return null;
  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${url_ip}/chat/messages/${receiverUsername}/`, {
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
        receiver: receiverUsername,
        message: newMessage,
      }),
    });
    setNewMessage("");
    fetchMessages();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.sender__username}:</Text>
            <Text style={styles.message}>{item.message}</Text>
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
    backgroundColor: "#121212", // Fondo oscuro
    padding: 10,
  },
  messageContainer: {
    backgroundColor: "#1E1E1E", // Fondo del mensaje
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  sender: {
    color: "#FFD700", // Amarillo para el nombre del usuario
    fontWeight: "bold",
  },
  message: {
    color: "#FFF", // Blanco para el texto del mensaje
  },
  input: {
    borderWidth: 1,
    borderColor: "#444", // Borde gris oscuro
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default ChatScreen;
