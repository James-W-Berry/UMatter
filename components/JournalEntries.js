import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import uuid from "uuid";

function JournalEntry({ id, title, body, date }) {
  return (
    <View key={id}>
      <TouchableOpacity onPress={() => onSelect(id)}>
        <Card title={title} image={require("../assets/umatter_banner.png")}>
          <Text style={{ marginBottom: 10 }}>{body}</Text>
          <Text style={{ marginBottom: 10 }}>{date}</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

function onSelect(id) {
  console.log(`journal entry ${id}`);
}

class JournalEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      journalEntries: this.getFromLocalStorage("journalEntries")
    };
  }

  componentWillMount() {
    this.clearLocalStorage();
    this.storeData();
  }

  clearLocalStorage() {
    AsyncStorage.removeItem("journalEntries");
  }

  getFromLocalStorage(key) {
    let value = {};
    try {
      value = AsyncStorage.getItem(key) || {};
    } catch (e) {
      console.log(e);
    }
    return value;
  }

  storeData = async () => {
    try {
      const journalEntry = {
        title: "Title 1",
        body: "Journal Entry Body 1",
        date: "November 12, 2019",
        id: uuid.v4()
      };
      const existingEntries = await AsyncStorage.getItem("journalEntries");
      let entries = JSON.parse(existingEntries);
      if (!entries) {
        entries = [];
      }
      entries.push(journalEntry);

      await AsyncStorage.setItem("journalEntries", JSON.stringify(entries))
        .then(() => {
          console.log(entries);
          this.setState({
            journalEntries: entries
          });
          console.log("new journal entry saved to storage");
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      // saving error
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.journalEntries}
          renderItem={({ item }) => (
            <JournalEntry
              id={item.id}
              title={item.title}
              body={item.body}
              date={item.date}
            />
          )}
          keyExtractor={item => item.id}
        />
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
