import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Cards from '@/components/Cards';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds from "react-native-google-mobile-ads";

export default function HomeScreen() {

  useEffect(() => {
    const checkConsent = async () => {
      try {
        if (Platform.OS === 'ios') {
          // Demander le consentement uniquement sur iOS
          await requestTrackingPermissionsAsync();

        }
        mobileAds()
          .initialize()
          .then((adapterStatuses) => {
            console.log("adapterStatuses", adapterStatuses);
          });
      } catch (error) {
        console.error('Erreur lors de la vérification du consentement :', error);
      }
    };

    checkConsent();
  }, []);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <Cards />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
