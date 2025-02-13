import { StyleSheet, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function TabOneScreen() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Button title="Cerrar Sesión" onPress={auth.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});