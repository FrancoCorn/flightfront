import { StyleSheet, Button, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

export default function TabOneScreen() {
  const auth = useContext(AuthContext);
  interface ProfileData {
    nombre: string;
    genero: string;
    licencias: string;
    aviones: string;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newLicenses, setNewLicenses] = useState<string>('');
  const [newAviones, setNewAviones] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (!auth) return null;

  const fetchProfileData = () => {
    if (auth.userToken) {
      fetch('http://192.168.1.15:8080/api/auth/user-info/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.userToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setProfileData(data);
        setNewLicenses(data.licencias);
        setNewAviones(data.aviones);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [auth.userToken]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.15:8080/api/auth/edit-user-licenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.userToken}`
        },
        body: JSON.stringify({ licencias: newLicenses, aviones: newAviones })
      });
      const data = await response.json();
      setProfileData(data);
      const response2 = await fetch('http://192.168.1.15:8080/api/auth/edit-user-planes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.userToken}`
        },
        body: JSON.stringify({ aviones: newAviones })
      });
      const data2 = await response2.json();
      setProfileData(data2);
      setIsEditing(false);
      fetchProfileData(); // Recarga el perfil después de guardar
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando perfil...</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando perfil...</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.editIcon}>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Icon name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.profileContainer}>
        <View style={styles.circle} />
        <View>
          <Text style={styles.nombre}>{profileData.nombre}</Text>
          <Text style={styles.genero}>{profileData.genero}</Text>
        </View>
      </View>
      
      <Text style={styles.label}>Licencias:</Text>
      <Text style={styles.value}>{profileData.licencias}</Text>
      <Text style={styles.label}>Aviones:</Text>
      <Text style={styles.value}>{profileData.aviones}</Text>
      
      <Button title="Cerrar Sesión" onPress={auth.logout} />

      <Modal visible={isEditing} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Licencias y Aviones</Text>
          <Text style={styles.label}>Licencias:</Text>
          <TextInput
            style={styles.input}
            value={newLicenses}
            onChangeText={setNewLicenses}
          />
          <Text style={styles.label}>Aviones:</Text>
          <TextInput
            style={styles.input}
            value={newAviones}
            onChangeText={setNewAviones}
          />
          <Button title="Guardar" onPress={handleSave} />
          <Button title="Cancelar" onPress={() => setIsEditing(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#1F2C37',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Centra el contenido horizontalmente
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative', // Permite posicionar el ícono de lápiz
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    right: 20, // Posiciona el ícono de lápiz a la derecha
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 30,
    alignSelf: 'flex-start',
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    marginRight: 15,
  },
  nombre: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  genero: {
    fontSize: 15,
    color: '#fff',
    marginTop: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  value: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2C37',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});