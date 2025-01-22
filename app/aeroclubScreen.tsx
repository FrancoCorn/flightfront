import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AeroclubScreen() {
  const { id } = useLocalSearchParams(); 
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta la barra de navegación
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Detalles del Aeroclub</Text>
      <View style={styles.rectangle}>
        <Text style={styles.idText}>ID: {id}</Text>
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
  },
  idText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
  },
  rectangle: {
    width: '90%',
    height: 200,
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});