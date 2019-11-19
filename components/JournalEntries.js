import React, { Component } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Card } from "react-native-elements";

class JournalEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntries: this.getJournalEntries()
    };
  }

  getJournalEntries = async () => {
    try {
      const value = await AsyncStorage.getItem("journalEntries");
      if (value !== null) {
        // value previously stored
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  createEntryCard = entry => {
    return (
      <View>
        <Card
          title={entry.title}
          image={require("../assets/umatter_banner.png")}
        >
          <Text style={{ marginBottom: 10 }}>{entry.body}</Text>
          <Text style={{ marginBottom: 10 }}>{entry.date}</Text>
        </Card>
      </View>
    );
  };

  storeData = async () => {
    try {
      const testEntries = [
        {
          title: "Title 1",
          body: "Journal Entry body 1",
          date: "November 12, 2019"
        },
        {
          title: "Title 2",
          body: "Journal Entry body 2",
          date: "November 13, 2019"
        },
        {
          title: "Title 3",
          body: "Journal Entry body 3",
          date: "November 14, 2019"
        }
      ];
      await AsyncStorage.setItem("journalEntries", testEntries);
    } catch (e) {
      // saving error
    }
  };

  componentDidMount() {}

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {_.map(this.state.journalEntries, entry => this.createEntryCard)}
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
