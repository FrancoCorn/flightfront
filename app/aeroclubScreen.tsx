import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Aeroclub} from './(tabs)/schools';

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
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta la barra de navegación
    });
  }, [navigation]);

  useEffect(() => {
      fetch(`http://127.0.0.1:8080/aeroclubes/get_aeroclub_by_id/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setAeroclub(data);
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
        <Text style={styles.img}>IMG</Text>
        <Text style={styles.idText}>{aeroclub.direccion}</Text>
        <Text style={styles.idText}>{aeroclub.categorias.join(', ')}</Text>
       
        <Text style={styles.idText}>Contacto: {aeroclub.contacto}</Text>
        <View style={styles.mapButton}>
          <Text style={{ color: '#fff' }}>Ver en el mapa</Text>
        </View>
        <View style={styles.contactButton}>
          <Text style={{ color: '#fff' }}>Contactar</Text>
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
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  idText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  rectangle: {
    flex: 2,
    marginBottom: 30,
    width: '90%',
    height: 600,
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    position: 'relative',
  },
  mapButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: '43%',
    height:40,
    backgroundColor: '#2B373F',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  contactButton: {
    position: 'absolute',
    bottom: 20,
    left: '53%',
    width: '43%',
    height: 40,
    backgroundColor: '#2B373F',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
});