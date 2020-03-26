import React, { Component } from "react";
import { Text, StyleSheet, StatusBar, View } from "react-native";

export default function Badges() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} translucent={true} />
      <Text>Your Badges</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  }
});
