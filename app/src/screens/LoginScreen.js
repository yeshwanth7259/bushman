import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    try {
      const formattedPhone = '+91' + phone;
      // Using the namespace API to guarantee initialization
      const authInstance = firebase.auth();
      const confirmation = await authInstance.signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
    } catch (error) {
      console.error(error);
      const errorMsg = error && error.message ? error.message : String(error);
      Alert.alert('Error', errorMsg);
    }
    setLoading(false);
  };

  const confirmCode = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const userCredential = await confirm.confirm(code);
      if (userCredential && userCredential.user) {
        // Send to profile setup instead of Home
        navigation.replace('ProfileSetup');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Invalid OTP code. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <Text style={styles.title}>BUSHMAN MEAT</Text>
          <Text style={styles.subtitle}>Welcome to Bushman Meat</Text>
          <Text style={styles.desc}>Fresh meat. Delivered fresh.</Text>
        </View>

        <View style={styles.form}>
          {!confirm ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile number"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, (phone.length < 10 || loading) && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={phone.length < 10 || loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Continue'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  maxLength={6}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, (code.length < 6 || loading) && styles.buttonDisabled]} 
                onPress={confirmCode}
                disabled={code.length < 6 || loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
              </TouchableOpacity>
            </>
          )}
          
          <Text style={styles.terms}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf5' },
  keyboardView: { flex: 1 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: '#171717' },
  subtitle: { fontSize: 24, fontWeight: '700', color: '#171717', marginTop: 10 },
  desc: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { paddingHorizontal: 24 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24
  },
  prefix: { fontSize: 18, color: '#171717', fontWeight: '600', marginRight: 12 },
  input: { flex: 1, fontSize: 18, color: '#171717' },
  button: {
    backgroundColor: '#dc2626',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: { backgroundColor: '#fca5a5' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  terms: { textAlign: 'center', color: '#666', fontSize: 12, marginTop: 24 }
});
