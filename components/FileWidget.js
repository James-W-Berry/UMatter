import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";

export default class FileWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.momentWidget}>
        <Text style={{ fontSize: 20 }}>File</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  momentWidget: {
    flex: 1,
    flexDirection: "row",
    height: 300,
    width: 300,
    alignItems: "center",
    backgroundColor: "#efefef",
    padding: 15,
    marginRight: 20,
    borderRadius: 10
  }
});
