import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({ navigation }: any) => {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [licencias, setLicencias] = useState("");
  const [aviones, setAviones] = useState("");

  if (!auth) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={nombre}
        secureTextEntry
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Genero"
        placeholderTextColor="#aaa"
        value={genero}
        secureTextEntry
        onChangeText={setGenero}
      />
      <TextInput
        style={styles.input}
        placeholder="Licencias"
        placeholderTextColor="#aaa"
        value={licencias}
        secureTextEntry
        onChangeText={setLicencias}
      />
      <TextInput
        style={styles.input}
        placeholder="Aviones"
        placeholderTextColor="#aaa"
        value={aviones}
        secureTextEntry
        onChangeText={setAviones}
      />

      <TouchableOpacity style={styles.button} onPress={() => auth.register(username, password, nombre, genero, licencias, aviones )}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loginContainer: {
    marginTop: 10,
  },
  loginText: {
    color: "#aaa",
    fontSize: 16,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default RegisterScreen;