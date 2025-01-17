import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Modal, View } from 'react-native';
import { Text } from '@/components/Themed';
import Icon from 'react-native-vector-icons/Ionicons';

type Aeroclub = {
  id: number;
  nombre: string;
  provincia: string;
};

export default function TabSchoolsScreen() {
  const [aeroclubs, setAeroclubs] = useState<Aeroclub[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAeroclubs, setFilteredAeroclubs] = useState<Aeroclub[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/aeroclubes/')
      .then((response) => response.json())
      .then((data) => {
        setAeroclubs(data);
        setFilteredAeroclubs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching aeroclubs:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredAeroclubs(
      aeroclubs.filter((aeroclub) =>
        aeroclub.nombre.toLowerCase().includes(search.toLowerCase()) ||
        aeroclub.provincia.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, aeroclubs]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escuelas de vuelo</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o provincia"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
          <Icon name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredAeroclubs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.aeroclubContainer}>
            <Text style={styles.aeroclubName}>{item.nombre}</Text>
            <Text style={styles.aeroclubProvincia}>{item.provincia}</Text>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros</Text>
            {/* Aquí puedes agregar los filtros que desees */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
  },
  aeroclubContainer: {
    backgroundColor: '#a5a5a5',
    borderRadius: 20,
    paddingLeft: 130,
    paddingRight: 130,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aeroclubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  aeroclubProvincia: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    color: '#007AFF',
  },
});