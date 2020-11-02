import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { FlatGrid, SectionGrid } from "react-native-super-grid";
import Constants from "expo-constants";
import breathing from "../assets/breathing.jpeg";
import games from "../assets/games.jpeg";
import inspiration from "../assets/inspiration.jpeg";
import support from "../assets/support.jpeg";

export default function Resources() {
  const [resourceTiles, setResourceTiles] = useState([
    { name: "Breathing Exercises", description: "#1abc9c", image: breathing },
    { name: "Inspiration", description: "#2ecc71", image: inspiration },
    { name: "Games", description: "#3498db", image: games },
    { name: "Support", description: "#9b59b6", image: support },
  ]);

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
      }}
    >
      <View style={styles.statusBar} />

      <FlatGrid
        itemDimension={130}
        data={resourceTiles}
        style={styles.gridView}
        spacing={10}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: item.code }}>
            <ImageBackground source={item.image} style={styles.image}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#2C239A",
    height: Constants.statusBarHeight,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    margin: 0,
    paddingTop: 5,
    paddingHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 0,
  },
  itemDescription: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 5,
    paddingBottom: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    borderWidth: 0,
  },
  image: {
    justifyContent: "flex-end",
    borderRadius: 10,
    height: 150,
    flex: 1,
    resizeMode: "cover",
  },
});
