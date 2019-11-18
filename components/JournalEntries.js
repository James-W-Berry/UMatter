import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";

class JournalEntries extends Component {
  render() {
    return (
      <View>
        <Image source={require("../assets/umatter_banner.png")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "28%"
  }
});

export default JournalEntries;
