import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import useCartStore from '../store/cartStore';

export default function CartScreen({ navigation }) {
  const { items, incrementQuantity, decrementQuantity, getTotalPrice } = useCartStore();

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.images && item.images.length > 0 ? item.images[0].src : 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.btn} onPress={() => decrementQuantity(item.id)}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => incrementQuantity(item.id)}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <View style={{ width: 50 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>₹{getTotalPrice()}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '800', color: '#171717' },
  backBtn: { padding: 8 },
  backText: { fontSize: 16, color: '#a31621', fontWeight: '600' },
  list: { padding: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#ffe4e6' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: '#171717', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '800', color: '#a31621', marginBottom: 8 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  btn: { width: 28, height: 28, backgroundColor: '#f5f5f5', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 18, fontWeight: '600', color: '#171717' },
  quantity: { fontSize: 16, fontWeight: '700', color: '#171717', marginHorizontal: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#666' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#171717' },
  checkoutBtn: { backgroundColor: '#a31621', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
