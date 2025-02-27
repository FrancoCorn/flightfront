import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

type Product = {
  id: number;
  nombre: string;
  precio: string;
  moneda: string;
  categoria: string;
  descripcion: string;
  contacto: string;
  imgUrls: string[];
  user: string;
};

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://192.168.1.21:8080/productos/${id}/?format=json`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
        headerShown: false, // Oculta la barra de navegación
        });
    }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar el producto</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>{product.nombre}</Text>
        <FlatList
          data={product.imgUrls}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
        <Text style={styles.price}>{product.precio} {product.moneda}</Text>
        <Text style={styles.sectionTitle}>Descripción:</Text>
        <Text style={styles.description}>{product.descripcion}</Text>
        <Text style={styles.contact}>Contacto: {product.contacto}</Text>
        <TouchableOpacity
        style={styles.contactButton}
        onPress={() => router.push(`/chatScreen?username=${product.user}`)}
        >
        <Text style={{ color: '#fff' }}>Contactar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1F2C37',
  },
  backButton: {
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2C37',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2C37',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
  card: {
    marginTop:20,
    backgroundColor: '#a5a5a5',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  price: {
    marginTop: 15,
    fontSize: 25,
    color: '#000',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  contact: {
    fontSize: 16,
    color: '#000',
  },
  contactButton: {
    width: '45%',
    height: 40,
    backgroundColor: '#2B373F',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});