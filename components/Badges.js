import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

export default class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
