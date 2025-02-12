import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const MapScreen = () => {
    const { maps } = useLocalSearchParams(); 
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, 
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <WebView 
                source={{ uri: Array.isArray(maps) ? maps[0] : maps }} 
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2C37', 
    },
    webview: {
        flex: 1,
        marginTop: 60, 
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1, 
    },
});

export default MapScreen;