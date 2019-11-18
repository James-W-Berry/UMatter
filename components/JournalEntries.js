import React, { Component } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Card } from "react-native-elements";

class JournalEntries extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Card
            title="Journal Entry 1"
            image={require("../assets/umatter_banner.png")}
          >
            <Text style={{ marginBottom: 10 }}>Lorem Ipsum</Text>
            <Text style={{ marginBottom: 10 }}>November 18, 2019</Text>
          </Card>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
