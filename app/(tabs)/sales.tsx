import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../supabaseConfig';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { router } from 'expo-router';

type Product = {
  id: number;
  nombre: string;
  precio: string;
  moneda: string;
  imgUrls: string[];
};

export default function TabSales() {
  const [selectedTab, setSelectedTab] = useState<keyof typeof urls>('Aeronaves');
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [categoria, setCategoria] = useState('Aeronaves');
  const [descripcion, setDescripcion] = useState('');
  const [contacto, setContacto] = useState('');
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingImages, setLoadingImages] = useState(false);
  const itemsPerPage = 20;
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const urls = {
    Aeronaves: 'http://192.168.1.21:8080/productos/aeronaves/?format=json',
    Indumentaria: 'http://192.168.1.21:8080/productos/indumentaria/?format=json',
    Repuestos: 'http://192.168.1.21:8080/productos/repuestos/?format=json',
    Otros: 'http://192.168.1.21:8080/productos/otros/?format=json',
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedTab, currentPage]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(urls[selectedTab]);
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePostProduct = async () => {
    if (auth.userToken) {
      try {
        const response = await fetch('http://192.168.1.21:8080/productos/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.userToken}`,
          },
          body: JSON.stringify({
            nombre,
            precio,
            moneda,
            categoria,
            descripcion,
            contacto,
            imgUrls,
          }),
        });

        if (response.ok) {
          alert('Producto publicado con éxito');
          setModalVisible(false);
          setNombre('');
          setPrecio('');
          setMoneda('ARS');
          setCategoria('Aeronaves');
          setDescripcion('');
          setContacto('');
          setImgUrls([]);
          fetchProducts();
        } else {
          alert('Error al publicar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al publicar el producto');
      }
    }
  };

  const pickImages = useCallback(async () => {
    setLoadingImages(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      for (let i = 0; i < result.assets.length; i++) {
        const img = result.assets[i];
        const localUri = img.uri;

        const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
        const filePath = `${auth.username}/${"image"}-${Date.now()}.${localUri.split('.').pop()}`;
        const contentType = img.mimeType;

        const response = await supabase.storage.from('productos').upload(filePath, decode(base64), { contentType });
        const { data, error } = await supabase.storage.from('productos').createSignedUrl(filePath, 60 * 60 * 7 * 4 * 12 * 10);
        if (error) {
          console.error('Error uploading image:', error);
        } else {
          setImgUrls((prevUrls) => [...prevUrls, data.signedUrl]);
        }
      }
    }
    setLoadingImages(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ventas</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => { /* Add settings functionality here */ }}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Aeronaves' && styles.selectedTab]}
          onPress={() => { setSelectedTab('Aeronaves'); setCurrentPage(1); }}
        >
          <Text style={[styles.tabText, selectedTab === 'Aeronaves' && styles.selectedTabText]}>Aeronaves</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Indumentaria' && styles.selectedTab]}
          onPress={() => { setSelectedTab('Indumentaria'); setCurrentPage(1); }}
        >
          <Text style={[styles.tabText, selectedTab === 'Indumentaria' && styles.selectedTabText]}>Indumentaria</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Repuestos' && styles.selectedTab]}
          onPress={() => { setSelectedTab('Repuestos'); setCurrentPage(1); }}
        >
          <Text style={[styles.tabText, selectedTab === 'Repuestos' && styles.selectedTabText]}>Repuestos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Otros' && styles.selectedTab]}
          onPress={() => { setSelectedTab('Otros'); setCurrentPage(1); }}
        >
          <Text style={[styles.tabText, selectedTab === 'Otros' && styles.selectedTabText]}>Otros</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts.slice(0, currentPage * itemsPerPage)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
                      onPress={() => router.push(`/productScreen?id=${item.id}`)}
                    >
          <View style={styles.productContainer}>
            <Image source={{ uri: item.imgUrls[0] }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.nombre}</Text>
              <Text style={styles.productPrice}>{item.precio} {item.moneda}</Text>
            </View>
          </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
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
            <Text style={styles.modalTitle}>Publicar Producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={moneda}
              style={styles.picker}
              onValueChange={(itemValue) => setMoneda(itemValue)}
            >
              <Picker.Item label="ARS" value="ARS" />
              <Picker.Item label="USD" value="USD" />
            </Picker>
            <Picker
              selectedValue={categoria}
              style={styles.picker}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              <Picker.Item label="Aeronaves" value="Aeronaves" />
              <Picker.Item label="Indumentaria" value="Indumentaria" />
              <Picker.Item label="Repuestos" value="Repuestos" />
              <Picker.Item label="Otros" value="Otros" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <TextInput
              style={styles.input}
              placeholder="Contacto"
              value={contacto}
              onChangeText={setContacto}
            />
            <TouchableOpacity style={styles.button} onPress={pickImages}>
              <Text style={styles.buttonText}>Seleccionar Imágenes</Text>
            </TouchableOpacity>
            {loadingImages && (
              <ActivityIndicator size="small" color="#1E90FF" style={styles.loadingIndicator} />
            )}
            {imgUrls.length > 0 && (
              <View style={styles.imageContainer}>
                {imgUrls.map((url, index) => (
                  <Image key={index} source={{ uri: url }} style={styles.image} />
                ))}
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, loadingImages && styles.buttonDisabled]}
              onPress={handlePostProduct}
              disabled={loadingImages}
            >
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
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
    backgroundColor: '#1F2C37',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    marginTop: 20,
    marginBottom: 20,
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
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2B373F',
  },
  selectedTab: {
    backgroundColor: '#a5a5a5',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: '#000',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#fff',
    color: '#000',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#a5a5a5',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#000',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#a5a5a5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  picker: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});