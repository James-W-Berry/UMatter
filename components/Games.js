import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import Constants from "expo-constants";
import sudoku from "../assets/sudoku.png";
import tetris from "../assets/tetris.jpg";
import dots from "../assets/dots.png";

export default function Games() {
  const [resourceTiles, setResourceTiles] = useState([
    {
      name: "Sudoku",
      code: "#9302F7",
      description: "Sudoku",
      image: sudoku,
      link:
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.brainium.sudoku.free&hl=en_US&gl=US"
          : "https://apps.apple.com/us/app/sudoku-com-number-games/id1193508329",
    },
    {
      name: "Tetris",
      code: "#A80F88",
      description: "Tetris",
      image: tetris,
      link:
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.n3twork.tetris&hl=en_US&gl=US"
          : "https://apps.apple.com/us/app/tetris/id1491074310",
    },
    {
      name: "Dots",
      code: "#F70B02",
      description: "Dots",
      image: dots,
      link:
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.nerdyoctopus.gamedots&hl=en_US&gl=US"
          : "https://apps.apple.com/us/app/dots-a-game-about-connecting/id632285588",
    },
  ]);

  function onSelect(item) {
    if (item.link !== null) {
      Linking.openURL(item.link);
    } else {
      Alert.alert(
        item.name,
        "coming soon",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
      }}
    >
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
