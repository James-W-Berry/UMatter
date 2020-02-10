import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationService from "./NavigationService";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

class JournalEntries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      journalEntries: [],
      debugMode: false
    };
  }

  componentDidMount() {
    this.retrieveJournalEntries();
  }

  createJournalEntry(item) {
    if (item !== undefined) {
      const key = item[0];
      const data = JSON.parse(item[1]);

      return (
        <View key={key}>
          <TouchableOpacity onPress={() => this.onSelect(item)}>
            <Card image={{ uri: data.image }}>
              <Text style={styles.title}>{data.title}</Text>
              <Text
                style={styles.caption}
                numberOfLines={1}
                style={{
                  marginBottom: 10
                }}
              >
                {data.body}
              </Text>
              <Text style={styles.date}>{data.date}</Text>
            </Card>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  onSelect(item) {
    const key = item[0];
    const data = JSON.parse(item[1]);
    NavigationService.navigate("JournalEntry", {
      key,
      data,
      onGoBack: () => {
        this.retrieveJournalEntries();
      }
    });
  }

  retrieveJournalEntries() {
    this.setState({ isLoading: true });

    try {
      AsyncStorage.getAllKeys().then(async keys => {
        let journalEntryKeys = [];

        for (const key in keys) {
          if (keys[key].includes("journal")) {
            journalEntryKeys.push(keys[key]);
          }
        }

        await AsyncStorage.multiGet(journalEntryKeys).then(result => {
          this.setState({ journalEntries: result });
        });
      });

      this.setState({ isLoading: false });
    } catch (e) {
      this.setState({
        isLoading: false
      });
      console.log(e.message);
    }
  }

  clearStorage() {
    AsyncStorage.clear();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.debugMode && (
          <TouchableOpacity
            style={styles.clearButton}
            title="Clear Storage"
            onPress={this.clearStorage}
          >
            <Text> Clear Storage</Text>
          </TouchableOpacity>
        )}
        <StatusBar
          backgroundColor="#191919"
          barStyle={"dark-content"}
          translucent={true}
        />
        <Text style={styles.pageTitle}>Journal</Text>

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
          <FlatList
            data={this.state.journalEntries}
            renderItem={({ item }) => this.createJournalEntry(item)}
            keyExtractor={index => index.toString()}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            NavigationService.navigate("NewJournalEntry", {
              onGoBack: () => {
                this.retrieveJournalEntries();
              }
            })
          }
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={50}
            color="#509C96"
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  pageTitle: {
    fontSize: 24,
    color: "#191919",
    alignSelf: "center",
    fontFamily: "montserrat-regular"
  },
  button: {
    elevation: 10,
    position: "absolute",
    bottom: 0,
    width: "26%",
    height: "10%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontFamily: "montserrat-medium"
  },
  caption: {
    fontSize: 8,
    fontFamily: "montserrat-regular"
  },
  date: {
    fontSize: 12,
    fontFamily: "montserrat-regular"
  },
  clearButton: {
    alignSelf: "center",
    width: "30%",
    backgroundColor: "#00A9A5"
  }
});

export default JournalEntries;
