import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import { FlatGrid, SectionGrid } from "react-native-super-grid";
import Constants from "expo-constants";
import breathing from "../assets/breathing.jpeg";
import games from "../assets/games.jpeg";
import inspiration from "../assets/inspiration.jpeg";
import support from "../assets/support.jpeg";
import move from "../assets/move.jpg";
import talk from "../assets/talk.jpeg";
import learn from "../assets/learn.jpeg";

export default function Resources() {
  const [resourceTiles, setResourceTiles] = useState([
    {
      name: "Breathe",
      code: "#9302F7",
      description: "Learn breathing practices",
      image: breathing,
    },
    {
      name: "Inspiration",
      code: "#A80F88",
      description: "Become inspired",
      image: inspiration,
    },
    {
      name: "Play",
      code: "#F70B02",
      description: "Enjoy games",
      image: games,
    },
    {
      name: "Move",
      code: "#1FDEA8",
      description: "Engage in physical activity",
      image: move,
    },
    {
      name: "Support",
      code: "#2C239A",
      description: "Collection of resources",
      image: support,
    },
    {
      name: "Learn",
      code: "#FA23E5",
      description: "Learn ",
      image: learn,
    },
    {
      name: "Talk",
      code: "#35C211",
      description: "Talk",
      image: talk,
    },
  ]);

  function onSelect(item) {
    Alert.alert(
      item.name,
      "coming soon",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

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
          <TouchableOpacity onPress={() => onSelect(item)}>
            <View
              style={[styles.itemContainer, { backgroundColor: item.code }]}
            >
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={item.image}
                  style={styles.image}
                  imageStyle={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                />
              </View>
              <View style={styles.itemLabelContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
  itemLabelContainer: {
    display: "flex",
    flexDirection: "column",
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  itemName: {
    fontSize: 16,
    fontFamily: "montserrat-medium",
    color: "#fff",
    fontWeight: "600",
    margin: 0,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  itemDescription: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 5,
    paddingBottom: 5,
    justifyContent: "flex-end",
    fontFamily: "montserrat-regular",
  },
  image: {
    justifyContent: "flex-end",
    flex: 1,
    resizeMode: "cover",
  },
  imageContainer: {
    flex: 1,
  },
});
