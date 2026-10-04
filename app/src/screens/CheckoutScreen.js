import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import useCartStore from '../store/cartStore';
import axios from 'axios';

const API_URL = 'https://bushman.onrender.com/api'; 

export default function CheckoutScreen({ navigation }) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: 'Bangalore',
    phone: ''
  });

  const handleCheckout = async () => {
    if (!form.firstName || !form.address || !form.phone) {
      Alert.alert('Error', 'Please fill in all required details');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: false,
        billing: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address,
          city: form.city,
          phone: form.phone,
          country: 'IN'
        },
        shipping: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address,
          city: form.city,
          country: 'IN'
        },
        line_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const res = await axios.post(`${API_URL}/orders`, orderData);
      
      if (res.data.success) {
        clearCart();
        Alert.alert('Success', 'Order placed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        throw new Error('Order failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        
        <TextInput
          style={styles.input}
          placeholder="First Name *"
          placeholderTextColor="#999"
          value={form.firstName}
          onChangeText={t => setForm({...form, firstName: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#999"
          value={form.lastName}
          onChangeText={t => setForm({...form, lastName: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          value={form.phone}
          onChangeText={t => setForm({...form, phone: t})}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Full Delivery Address *"
          multiline
          placeholderTextColor="#999"
          value={form.address}
          onChangeText={t => setForm({...form, address: t})}
        />
        
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethod}>
          <View style={styles.radioActive} />
          <Text style={styles.paymentText}>Cash on Delivery (COD)</Text>
        </View>
        <Text style={styles.noteText}>Online payment gateways will be added soon.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <Text style={styles.totalPrice}>₹{getTotalPrice()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '800', color: '#171717' },
  backBtn: { padding: 8 },
  backText: { fontSize: 16, color: '#a31621', fontWeight: '600' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#171717', marginBottom: 16, marginTop: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 16, fontSize: 16, color: '#171717', marginBottom: 12 },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#a31621', marginBottom: 8 },
  radioActive: { width: 20, height: 20, borderRadius: 10, borderWidth: 6, borderColor: '#a31621', marginRight: 12 },
  paymentText: { fontSize: 16, fontWeight: '600', color: '#171717' },
  noteText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 40 },
  footer: { padding: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#666' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#171717' },
  checkoutBtn: { backgroundColor: '#a31621', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
