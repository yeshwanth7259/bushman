import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';

import useCartStore from '../store/cartStore';

const { width } = Dimensions.get('window');
const API_URL = 'https://bushman.onrender.com/api'; 

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, items } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/categories`)
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) {
          setSelectedCategory(catRes.data.categories[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categories.some(c => c.id === selectedCategory))
    : products;

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.images && item.images.length > 0 ? item.images[0].src : 'https://via.placeholder.com/150' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.regular_price && item.regular_price !== item.price && (
            <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Delivery to</Text>
          <Text style={styles.location}>📍 HSR Layout, Bangalore</Text>
        </View>
        <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIconText}>🛒</Text>
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#a31621" /></View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={() => (
            <>
              <View style={styles.banner}>
                <Image source={{uri: 'https://bushmanmeat.com/wp-content/uploads/2023/11/slider-1.jpg'}} style={StyleSheet.absoluteFillObject} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>FRESH MEAT.</Text>
                  <Text style={styles.bannerTitle}>REAL TASTE.</Text>
                  <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Shop Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.categoryContainer}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.categoryPill, selectedCategory === item.id && styles.categoryPillActive]}
                      onPress={() => setSelectedCategory(item.id)}
                    >
                      <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>
                        {item.name.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  locationLabel: { fontSize: 12, color: '#999', fontWeight: '600' },
  location: { color: '#171717', fontSize: 14, fontWeight: '700', marginTop: 2 },
  cartIcon: { padding: 8, backgroundColor: '#f5f5f5', borderRadius: 20, position: 'relative' },
  cartIconText: { fontSize: 20 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#a31621', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  banner: { height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 24, backgroundColor: '#000' },
  bannerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 24, justifyContent: 'center' },
  bannerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  bannerButton: { backgroundColor: '#a31621', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginTop: 12 },
  bannerButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  categoryContainer: { marginBottom: 20 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee', marginRight: 10 },
  categoryPillActive: { backgroundColor: '#a31621' },
  categoryText: { fontSize: 13, fontWeight: '700', color: '#666' },
  categoryTextActive: { color: '#fff' },
  productCard: {
    width: (width - 48) / 2, // 2 columns with 16 padding on sides and 16 between
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  productImage: { width: '100%', height: 140, backgroundColor: '#ffe4e6', resizeMode: 'cover' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: '#171717', marginBottom: 8, height: 40 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 16, fontWeight: '800', color: '#a31621', marginRight: 8 },
  regularPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
  addButton: { backgroundColor: '#a31621', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 }
});
