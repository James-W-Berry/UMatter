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
  RefreshControl,
  Platform
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import { Icon } from "react-native-elements";
import NavigationService from "./NavigationService";

class JournalEntries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      journalEntries: []
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
        await AsyncStorage.multiGet(keys).then(result => {
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

  render() {
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
          <FlatList
            data={this.state.journalEntries}
            renderItem={({ item }) => this.createJournalEntry(item)}
            keyExtractor={index => index.toString()}
          />
        </ScrollView>

        <View style={styles.button}>
          <TouchableOpacity>
            <Icon
              raised
              name="pencil"
              type="material-community"
              color="#44CADD"
              reverse={true}
              onPress={() =>
                NavigationService.navigate("NewJournalEntry", {
                  onGoBack: () => {
                    this.retrieveJournalEntries();
                  }
                })
              }
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0
  },
  button: {
    elevation: 10,
    position: "absolute",
    alignSelf: "flex-end",
    padding: 20,
    bottom: 0
  },
  title: {
    fontSize: 20
  },
  caption: {
    fontSize: 8
  },
  date: {
    fontSize: 12
  }
});

export default JournalEntries;
