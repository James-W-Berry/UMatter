import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import { Icon } from "react-native-elements";
import NavigationService from "./NavigationService";

function JournalEntry({ id, title, body, image, date }) {
  console.log(`creating card for entry ${id}`);
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
      journalEntries: null,
      isLoading: false
    };
  }

  componentDidMount() {
    //AsyncStorage.clear();
    this.retrieveJournalEntries();
  }

  retrieveJournalEntries() {
    this.setState({ isLoading: true });

    try {
      AsyncStorage.getItem("journalEntries")
        .then(response => {
          if (response !== null) {
            return response;
          } else {
            console.log("no journal entries found");
          }
        })
        .then(entries => {
          this.setState({ journalEntries: entries });
          this.setState({ isLoading: false });
        });
    } catch (e) {
      this.setState({
        isLoading: false
      });
      console.log(e.message);
    }
  }

  render() {
    console.log(this.state.journalEntries);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            alignSelf: "flex-end",
            flexGrow: 1
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.retrieveJournalEntries()}
            />
          }
        >
          {this.state.journalEntries !== undefined && (
            <FlatList
              data={JSON.parse(this.state.journalEntries)}
              renderItem={({ item }) => (
                <JournalEntry
                  id={item.id}
                  title={item.title}
                  body={item.body}
                  date={item.date}
                  image={item.image}
                />
              )}
              keyExtractor={item => item.id}
              inverted={true}
            />
          )}
        </ScrollView>

        <View style={styles.button}>
          <TouchableOpacity>
            <Icon
              raised
              name="pencil"
              type="material-community"
              color="#44CADD"
              reverse={true}
              onPress={() => NavigationService.navigate("NewJournalEntry")}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    elevation: 10,
    alignSelf: "flex-end",
    padding: 8
  }
});

export default JournalEntries;
