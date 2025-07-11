import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Modal, View } from 'react-native';
import { Text } from '@/components/Themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { useAeroclubContext } from '../context/AeroclubContext'; // Importa el contexto

import { router } from 'expo-router';

export const url_ip = 'http://192.168.1.21:8080';

const categories = [
  { id: 1, name: 'Planeador' },
  { id: 2, name: 'Avión privado' },
  { id: 3, name: 'Avión comercial' },
  { id: 6, name: 'Fuerzas armadas' },
  { id: 7, name: 'Paracaídas' },
  { id: 4, name: 'Helicóptero privado' },
  { id: 5, name: 'Helicóptero comercial' },
];

export default function TabSchoolsScreen() {
  const navigation = useNavigation<{ navigate: (screen: string, params: { aeroclubId: number }) => void }>();
  const { aeroclubs, loading, fetchAeroclubs } = useAeroclubContext(); // Usa el contexto
  const [search, setSearch] = useState('');
  const [filteredAeroclubs, setFilteredAeroclubs] = useState(aeroclubs);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const auth = useContext(AuthContext);

  useEffect(() => {
    setFilteredAeroclubs(
      aeroclubs
        .filter((aeroclub) =>
          aeroclub.nombre.toLowerCase().includes(search.toLowerCase()) ||
          aeroclub.provincia.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.id - b.id)
    );
  }, [search, aeroclubs]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const paginatedAeroclubs = filteredAeroclubs.slice(0, currentPage * itemsPerPage);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Escuelas de vuelo</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
            <Icon name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
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
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Escuelas de vuelo</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron aeroclubes</Text>
          </View>
        )}
        data={paginatedAeroclubs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/aeroclubScreen?id=${item.id}`)}
          >
            <View style={styles.aeroclubContainer}>
              <Text style={styles.aeroclubName}>{item.nombre}</Text>
              <Text style={styles.aeroclubProvincia}>{item.provincia}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Categorias</Text>
            {categories.map((category) => (
              <View key={category.id} style={styles.filterItem}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => {
                    setSelectedFilters((prevFilters) => ({
                      ...prevFilters,
                      [category.id]: !prevFilters[category.id],
                    }));
                  }}
                >
                  {selectedFilters[category.id] ? (
                    <Icon name="checkbox" size={24} color='#1F2C37' />
                  ) : (
                    <Icon name="square-outline" size={24} color='#1F2C37' />
                  )}
                </TouchableOpacity>
                <Text style={styles.filterText}>{category.name}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                const selectedCategoryIds = Object.keys(selectedFilters)
                  .filter((categoryId) => selectedFilters[categoryId])
                  .join(",");

                if (selectedCategoryIds) {
                  fetch(`${url_ip}/aeroclubes/get_aeroclubs_with_category/${selectedCategoryIds}/`)
                    .then((response) => response.json())
                    .then((data) => {
                      setFilteredAeroclubs(data);
                    })
                    .catch((error) => {
                      console.error("Error fetching aeroclubs:", error);
                    });
                } else {
                  fetchAeroclubs();
                }

                setModalVisible(false);
              }}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    marginTop: 10,
    marginBottom: 17,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '95%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  checkbox: {
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    color: '#1F2C37',
  },
  applyButton: {
    backgroundColor: "#1F2C37",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
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