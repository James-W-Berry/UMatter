import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Button } from "react-native-elements";
import uuid from "uuid";

export default class Moments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  saveNewMoment = async () => {
    try {
      console.log("trying to save new scheduled moment to local storage");
      const momentId = `moment_${this.state.selected}_${uuid.v4()}`;

      const newMoment = {
        title: this.state.newMomentTitle,
        date: this.state.selected,
        time: "09:00",
        series: "",
        id: momentId
      };

      await AsyncStorage.setItem(momentId, JSON.stringify(newMoment))
        .then(() => {
          console.log(`new scheduled moment ${momentId} saved to storage`);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  retrieveMoments(day) {
    this.setState({ isLoading: true });

    try {
      AsyncStorage.getAllKeys().then(async keys => {
        let momentKeys = [];

        for (const key in keys) {
          if (keys[key].includes(`moment_${day}`)) {
            momentKeys.push(keys[key]);
          }
        }

        await AsyncStorage.multiGet(momentKeys).then(result => {
          this.setState({ moments: result });
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

  deleteMoment = async key => {
    try {
      console.log(`deleting moment ${key}`);
      AsyncStorage.removeItem(key).then(response => {
        console.log(response);
        this.retrieveMoments(this.state.selected);
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  createMomentWidget(item) {
    if (item !== undefined) {
      const key = item[0];
      const data = JSON.parse(item[1]);
      console.log(data);
      return (
        <View key={key} style={styles.momentWidget}>
          <Text>{data.title} @ </Text>
          <Text>{data.time}</Text>
          <TouchableOpacity
            style={styles.deleteMomentButton}
            title="Delete"
            onPress={() => this.deleteMoment(data.id)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={{
            [this.state.selected]: {
              selected: true,
              disableTouchEvent: true
            }
          }}
        />
        {this.state.selected && (
          <View style={styles.container}>
            <View style={styles.momentSummary}>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  flexGrow: 1
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => this.retrieveMoments(this.state.selected)}
                  />
                }
              >
                <FlatList
                  data={this.state.moments}
                  renderItem={({ item }) => this.createMomentWidget(item)}
                  keyExtractor={index => index.toString()}
                />
              </ScrollView>
            </View>

            <View style={styles.momentScheduler}>
              <View style={styles.newMoment}>
                <TextInput
                  style={styles.newMomentTitle}
                  placeholder="Title"
                  onChangeText={text => this.setState({ newMomentTitle: text })}
                  value={this.state.title}
                  numberOfLines={1}
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  title="Save"
                  onPress={this.saveNewMoment}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.unscheduledMoment}>
              <Button style={styles.startButton} title="Start"></Button>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    this.retrieveMoments(day.dateString);
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 350
  },
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10
  },
  container: {
    flex: 1
  },
  momentSummary: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#bbb"
  },
  momentScheduler: {
    flex: 1,
    justifyContent: "center"
  },
  newMoment: {
    backgroundColor: "#f7f7f8",
    flex: 1
  },
  newMomentTitle: {
    flex: 1,
    margin: 8
  },
  startButton: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#00A9A5"
  },
  saveButton: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 0,
    width: "30%",
    backgroundColor: "#00A9A5"
  },
  momentWidget: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#bbb"
  },
  deleteMomentButton: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 0,
    width: "30%",
    backgroundColor: "#afaf"
  },
  unscheduledMoment: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#bbb"
  }
});
