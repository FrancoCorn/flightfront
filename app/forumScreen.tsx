import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { url_ip } from "./(tabs)/schools";
import { AuthContext } from "./context/AuthContext";

export const ForumScreen = () => {
  const auth = useContext(AuthContext);
  const { username } = useLocalSearchParams();
  const [messages, setMessages] = useState<{ sender__username: string; message: string;  timestamp: string  }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  if (!auth) return null;

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${url_ip}/chat/forumrecieve/`, {
      headers: {
        'Authorization': `Bearer ${auth.userToken}`
      }
    });
    const data = await response.json();
    setMessages(data.reverse());
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem("userToken");
    await fetch(`${url_ip}/chat/forumsend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.userToken}`
      },
      body: JSON.stringify({
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
    width: "100%",
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
    color: "#fff", // Amarillo para el nombre del usuario
    fontWeight: "bold",
  },
  message: {
    color: "#FFF", // Blanco para el texto del mensaje
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
  timestamp: {
    color: "#bbb",
    fontSize: 10,
    alignSelf: "flex-end",
  },
});

export default ForumScreen;