import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons';
import { ForumScreen } from "../forumScreen";

const CommunicationScreen = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("Mensajes Privados");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; username: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);

  interface Chat {
    username: string;
    message: string;
    timestamp: string;
    tipo: string;
    id_other_user: number;
  }
  interface User {
    username: string;

  }
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);

  if (!auth) return null;

  const fetchChats = async () => {
    try {
      const response = await fetch("http://192.168.1.21:8080/chat/active/", {
        headers: {
          'Authorization': `Bearer ${auth.userToken}`
        }
      });
      const data = await response.json();
      setChats(data);
      setFilteredChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://192.168.1.21:8080/users/all/?format=json");
      const data = await response.json();

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.username.toLowerCase().includes(query.toLowerCase()) ||
        chat.message.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  const handleSearchUser = (query: string) => {
    setUserSearchQuery(query);
    if (query === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleChatPress = (username: string) => {
    router.push(`/chatScreen?username=${username}`);
  };

  const handleConfirm = () => {
    if (selectedUser) {
      router.push(`/chatScreen?username=${selectedUser.username}`);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Comunicación</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === "Mensajes Privados" && styles.selectedOption]}
          onPress={() => setSelectedOption("Mensajes Privados")}
        >
          <Text style={[styles.optionText, selectedOption === "Mensajes Privados" && styles.selectedOptionText]}>
            Mensajes Privados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === "Foro" && styles.selectedOption]}
          onPress={() => setSelectedOption("Foro")}
        >
          <Text style={[styles.optionText, selectedOption === "Foro" && styles.selectedOptionText]}>
            Foro
          </Text>
        </TouchableOpacity>
      </View>

      {selectedOption === "Mensajes Privados" && (
        <>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar mensajes..."
            placeholderTextColor="#bbb"
            style={styles.searchInput}
          />
          <FlatList
            data={filteredChats}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleChatPress(item.username)}>
                <View style={styles.chatContainer}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.message}><Text style={styles.tipo}>{item.tipo === "enviado" ? "Enviado: " : "Recibido: "}</Text>{item.message}</Text>
                  <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                  
                </View>
                <View style={styles.separator} />
              </TouchableOpacity>
            )}
          />
          
        </>
      )}

      {selectedOption === "Foro" && (
        <View style={styles.forumContainer}>
          <ForumScreen /> 
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#000" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Seleccionar usuario</Text>
            <TextInput
              value={userSearchQuery}
              onChangeText={handleSearchUser}
              placeholder="Buscar usuario..."
              placeholderTextColor="#bbb"
              style={styles.searchInput}
            />
            <FlatList
              data={filteredUsers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedUser(item)}>
                  <View style={[styles.userContainer, selectedUser?.username === item.username && styles.selectedUser]}>
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {settingsVisible && (
        <TouchableOpacity style={styles.overlay} onPress={() => setSettingsVisible(false)}>
          <View style={styles.settingsMenu}>
            <TouchableOpacity style={styles.settingsOption} onPress={() => { router.push(`/profile`) }}>
              <Text style={styles.settingsOptionText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsOption} onPress={auth?.logout}>
              <Text style={styles.settingsOptionText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2C37', 
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    marginTop: 15,
    marginBottom: 25,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#2B373F",
  },
  selectedOption: {
    backgroundColor: "#a5a5a5",
  },
  optionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedOptionText: {
    color: "#000",
  },
  separator: {
    marginVertical: 3,
    height: 1,
    width: '95%',
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#444", // Borde gris oscuro
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  chatContainer: {
    backgroundColor: "#1F2C37", // Fondo del mensaje
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  username: {
    color: "#fff", // Amarillo para el nombre del usuario
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "#FFF", // Blanco para el texto del mensaje
  },
  timestamp: {
    color: "#bbb", // Gris claro para la marca de tiempo
    fontSize: 12,
  },
  tipo: {
    color: "#bbb", // Gris claro para el tipo de mensaje
    fontSize: 12,
  },
  forumContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  forumText: {
    color: "#FFF",
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#a5a5a5",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 20,
  },
  userContainer: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  selectedUser: {
    backgroundColor: "#1E90FF",
  },
  confirmButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingsMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    padding: 10,
  },
  settingsOption: {
    marginVertical: 5,
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default CommunicationScreen;