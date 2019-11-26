import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

export default class SmileFile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Smile File</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
