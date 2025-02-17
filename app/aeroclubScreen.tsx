import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Aeroclub, url_ip } from './(tabs)/schools';

export default function AeroclubScreen() {
  const { id } = useLocalSearchParams(); 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [aeroclub, setAeroclub] = useState<Aeroclub>({
    id: 0,
    nombre: '',
    provincia: '',
    direccion: '',
    latitud: 0,
    longitud: 0,
    contacto: '',
    categorias: [],
    maps: '',
    img: '',
    user: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta la barra de navegación
    });
  }, [navigation]);

  useEffect(() => {
      fetch(`${url_ip}/aeroclubes/get_aeroclub_by_id/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setAeroclub(data);
          console.log(data)
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching aeroclubs:', error);
          setLoading(false);
        });
    }, []);

    if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        );
      }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{aeroclub.nombre}</Text>
      <View style={styles.rectangle}>
        <Image source={{ uri: aeroclub.img }} style={styles.img} />
        <Text style={styles.idText}>{aeroclub.direccion}</Text>
        <Text style={styles.idText}>{aeroclub.categorias.join(', ')}</Text>
        <Text style={styles.idText}>Contacto: {aeroclub.contacto}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.push(`/mapScreen?maps=${aeroclub.maps}`)}
            style={styles.mapButton}
          >
            <Text style={{ color: '#fff' }}>Ver en el mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}
          
          onPress={() => router.push(`/chatScreen?username=${aeroclub.user}`)}>
            <Text style={{ color: '#fff' }}>Contactar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  img: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  idText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'left', // Align text to the left
    width: '100%', // Ensure the text takes full width
  },
  rectangle: {
    flex: 2,
    marginBottom: 30,
    width: '90%',
    height: 600,
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    position: 'relative',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: '5%',
  },
  mapButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#2B373F',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#2B373F',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
