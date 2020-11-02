import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "./firebase";
import "firebase/auth";
import * as Font from "expo-font";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import NavigationService from "./components/NavigationService";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default function App() {
  const [user, setUser] = useState({ loggedIn: false, isLoaded: false });
  const [fontIsLoaded, setFontIsLoaded] = useState(false);

  async function loadFont() {
    await Font.loadAsync({
      "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "montserrat-medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    });

    setFontIsLoaded(true);
  }

  useEffect(() => {
    loadFont();

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser({ loggedIn: true, isLoaded: true });
        NavigationService.navigate("Home");
      } else {
        setUser({ loggedIn: false, isLoaded: true });
        NavigationService.navigate("SignInPage");
      }
    });
  }, []);

  if (fontIsLoaded && user.isLoaded) {
    return (
      <SafeAreaProvider>
        <Main style={styles.container} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#509C96" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#2C239A",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
