import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { fetchDogs, Dog, fetchPetShops, PetShop } from '../api/api';

export default function HomeScreen() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [petShops, setPetShops] = useState<PetShop[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeButton, setActiveButton] = useState<'dogs' | 'petshops' | null>(null);

  const handleFetchDogs = async () => {
    setActiveButton('dogs');
    try {
      const data = await fetchDogs();
      setDogs(data);
      setPetShops([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados dos cachorros.');
    }
  };

  const handleFetchPetShops = async () => {
    setActiveButton('petshops');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      const data = await fetchPetShops(latitude, longitude);
      setPetShops(data);
      setDogs([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as pet shops próximas.');
    }
  };

  const renderDog = ({ item }: { item: Dog }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.breeds[0]?.name || 'Desconhecido'}</Text>
        <Text style={styles.description}>{item.breeds[0]?.temperament || 'Sem descrição'}</Text>
        <Text style={styles.origin}>Origem: {item.breeds[0]?.origin || 'Desconhecida'}</Text>
      </View>
    </View>
  );

  const renderPetShop = ({ item }: { item: PetShop }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>Endereço: {item.address}</Text>
      <Text style={styles.rating}>Distância: {item.distance}m</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeButton === 'dogs' && (
        <FlatList
          data={dogs}
          keyExtractor={(item) => item.id}
          renderItem={renderDog}
          contentContainerStyle={styles.list}
        />
      )}
      {activeButton === 'petshops' && (
        <FlatList
          data={petShops}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPetShop}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeButton === 'dogs' ? styles.activeButton : styles.inactiveButton]}
          onPress={handleFetchDogs}
        >
          <Text style={styles.buttonText}>Carregar Cachorros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeButton === 'petshops' ? styles.activeButton : styles.inactiveButton]}
          onPress={handleFetchPetShops}
        >
          <Text style={styles.buttonText}>Pet Shops Próximas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 15 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  description: { fontSize: 14, color: '#666', marginBottom: 10, lineHeight: 20 },
  origin: { fontSize: 14, color: '#444', marginBottom: 5 },
  rating: { fontSize: 14, color: '#888' },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 5, alignItems: 'center', borderWidth: 1 },
  activeButton: { backgroundColor: '#007bff', borderColor: '#007bff' },
  inactiveButton: { backgroundColor: '#e9ecef', borderColor: '#ced4da' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});