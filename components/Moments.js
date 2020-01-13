import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { Calendar } from "react-native-calendars";
import uuid from "uuid";
import { Icon } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MomentWidget from "./MomentWidget";
import { Notifications } from "expo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

export default class Moments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moments: [],
      isDateTimePickerVisible: false,
      showActionButton: true
    };

    this.onDayPress = this.onDayPress.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.listenForNotifications();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      let { status } = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      console.log(status);
      if (status !== "granted") {
        alert("Sorry, we need notification permissions to make this work!");
      }
    }
  };

  listenForNotifications = () => {
    Notifications.addListener(this._handleNotification);
  };

  _handleNotification = ({ origin, data, remote }) => {
    message = data.message;
    let info = `Start your moment!`;
    Alert.alert(`UMatter - ${message}`, info);
  };

  showDateTimePicker = () => {
    console.log(this.state.isDateTimePickerVisible);
    this.setState({ isDateTimePickerVisible: true });
    console.log(this.state.isDateTimePickerVisible);
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };

  saveNewMoment = async () => {
    try {
      console.log("trying to save new scheduled moment to local storage");
      const momentId = `moment_${this.state.selected}_${uuid.v4()}`;

      const newMoment = {
        title: this.state.newMomentTitle,
        date: this.state.selected,
        time: "08:00 am",
        series: "",
        id: momentId
      };

      await AsyncStorage.setItem(momentId, JSON.stringify(newMoment))
        .then(() => {
          console.log(`new scheduled moment saved to storage: `);
          console.log(newMoment);
          this.setState({ showScheduler: false });
          this.retrieveMoments(this.state.selected);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e.message);
    }
    this.setState({ showActionButton: true });
  };

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

  createMomentWidget(item) {
    if (item !== undefined) {
      const key = item[0];
      const data = JSON.parse(item[1]);
      console.log(data);
      return (
        <View key={key} style={styles.momentWidget}>
          <MomentWidget
            id={key}
            moment={data}
            deleteMoment={this.deleteMoment}
            retrieveMoments={this.retrieveMoments}
            selectedDate={this.state.selected}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
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
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isLoading}
                      onRefresh={() =>
                        this.retrieveMoments(this.state.selected)
                      }
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
              {this.state.showScheduler && (
                <View style={styles.momentScheduler}>
                  <View style={styles.newMoment}>
                    <TextInput
                      style={styles.newMomentTitle}
                      placeholder="Moment title"
                      autoFocus={true}
                      onChangeText={text =>
                        this.setState({ newMomentTitle: text })
                      }
                      value={this.state.title}
                      numberOfLines={1}
                    />

                    <TouchableOpacity
                      title="Save"
                      onPress={this.saveNewMoment}
                      style={styles.saveButton}
                    >
                      <Icon
                        name="check"
                        type="material-community"
                        color="#02D351"
                        height="90%"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      title="Cancel"
                      onPress={() =>
                        this.setState({
                          showScheduler: false,
                          showActionButton: true
                        })
                      }
                      style={styles.cancelButton}
                    >
                      <Icon
                        name="cancel"
                        type="material-community"
                        color="#F12E17"
                        height="90%"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {this.state.showActionButton && (
                <View style={{ flex: 1 }}>
                  <ActionButton buttonColor="#44CADD">
                    <ActionButton.Item
                      buttonColor="#44CADD"
                      title="Schedule Moment"
                      onPress={() =>
                        this.setState({
                          showScheduler: true,
                          showActionButton: false
                        })
                      }
                    >
                      <Icon
                        style={styles.actionButtonIcon}
                        name="plus"
                        type="material-community"
                        color="#44CADD"
                        reverse={true}
                      />
                    </ActionButton.Item>
                    <ActionButton.Item
                      buttonColor="#44CADD"
                      title="Start Moment Now"
                      onPress={() => {}}
                    >
                      <Icon
                        style={styles.actionButtonIcon}
                        name="plus"
                        type="material-community"
                        color="#44CADD"
                        reverse={true}
                      />
                    </ActionButton.Item>
                  </ActionButton>
                </View>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
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
    flex: 1,
    borderTopWidth: 1,
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
    flex: 3,
    alignItems: "center"
  },
  momentScheduler: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: "#efefef"
  },
  newMoment: {
    flex: 1,
    flexDirection: "row"
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
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "25%",
    alignSelf: "center",
    width: "20%",
    height: "90%"
  },
  cancelButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "5%",
    alignSelf: "center",
    width: "20%",
    height: "90%"
  },
  momentWidget: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%"
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
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
