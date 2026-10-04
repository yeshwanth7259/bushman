import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';

// LIVE SERVER URL: 
const API_URL = 'https://bushman.onrender.com/api'; 

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from our Node.js backend
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    
    // fetchProducts();
    // For mockup purposes before DB is fully populated:
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Chicken Breast - 1 kg', price: 356, regular_price: '383', images: [{ src: 'https://via.placeholder.com/150' }] },
        { id: 2, name: 'Chicken Curry Cut - 1 kg', price: 373, regular_price: '422', images: [{ src: 'https://via.placeholder.com/150' }] },
        { id: 3, name: 'Chicken Leg - 1 kg', price: 220, regular_price: '245', images: [{ src: 'https://via.placeholder.com/150' }] }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.regular_price && <Text style={styles.regularPrice}>₹{item.regular_price}</Text>}
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.location}>📍 HSR Layout, Bangalore</Text>
        <Text style={styles.title}>Shop by Category</Text>
      </View>
      
      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#dc2626" /></View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          ListHeaderComponent={() => (
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>FRESH MEAT.</Text>
              <Text style={styles.bannerTitle}>REAL TASTE.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf5' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  location: { color: '#666', fontSize: 14, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#171717' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  banner: { backgroundColor: '#171717', borderRadius: 12, padding: 24, marginBottom: 24 },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  imagePlaceholder: { width: 100, height: 100, backgroundColor: '#ffe4e6', borderRadius: 8, marginRight: 16 },
  productInfo: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '700', color: '#171717', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 18, fontWeight: '700', color: '#dc2626', marginRight: 8 },
  regularPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  addButton: { backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start' },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
