import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* We would use an actual image here, using text for mockup */}
        <Text style={styles.logoText}>BUSHMAN</Text>
        <Text style={styles.logoSubText}>MEAT</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>FRESH MEAT.</Text>
        <Text style={styles.tagline}>REAL TASTE.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  logoSubText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 4,
    marginTop: -10,
  },
  divider: {
    height: 2,
    width: 100,
    backgroundColor: '#dc2626',
    marginVertical: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a3a3a3',
    letterSpacing: 1,
  }
});
