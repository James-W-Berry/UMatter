import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";

export default class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} translucent={true} />

        <Text>Your Badges</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
