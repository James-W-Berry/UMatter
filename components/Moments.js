import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
  AsyncStorage,
  KeyboardAvoidingView,
  Alert,
  Text,
  StatusBar
} from "react-native";
import { Calendar } from "react-native-calendars";
import uuid from "uuid";
import { Icon } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MomentWidget from "./MomentWidget";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import NavigationService from "./NavigationService";
import DateTimePicker from "react-native-modal-datetime-picker";

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
    let { status } = await Permissions.askAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    console.log(status);
    if (status !== "granted") {
      alert("Sorry, we need notification permissions to make this work!");
    }
  };

  listenForNotifications = () => {
    Notifications.addListener(this._handleNotification);
  };

  _handleNotification = ({ origin, data, remote }) => {
    message = data.message;
    let info = `Start your moment!`;
    Alert.alert(
      `UMatter - ${message}`,
      info,
      [
        {
          text: "Begin",
          onPress: () => {
            console.log("starting moment");
            NavigationService.navigate("MomentVisualization");
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };

  saveNewMoment = async date => {
    try {
      const momentId = `moment_${this.state.selected}_${uuid.v4()}`;

      const newMoment = {
        title: "",
        date: this.state.selected,
        time: date,
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

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();
    this.saveNewMoment(date);
  };

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

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
    this.retrieveMoments(day.dateString);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} translucent={true} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <Calendar
            style={styles.calendar}
            onDayPress={this.onDayPress}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#2C239A",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#ffffff",
              selectedDayTextColor: "#3E31B1",
              todayTextColor: "#509C96",
              dayTextColor: "#ffffff",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#509C96",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "#ffffff",
              indicatorColor: "blue",
              textDayFontFamily: "montserrat-regular",
              textMonthFontFamily: "montserrat-regular",
              textDayHeaderFontFamily: "montserrat-regular",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 24,
              textDayHeaderFontSize: 16
            }}
            hideExtraDays
            hideDayNames
            markedDates={{
              [this.state.selected]: {
                selected: true,
                disableTouchEvent: true
              }
            }}
          />
          {this.state.selected && (
            <View style={styles.dayView}>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                mode="time"
                isDarkModeEnabled={true}
              />
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

              {this.state.showActionButton && (
                <ActionButton buttonColor="#509C96">
                  <ActionButton.Item
                    buttonColor="#509C96"
                    title="Schedule Moment"
                    onPress={() =>
                      this.setState({
                        showActionButton: false,
                        isDateTimePickerVisible: true
                      })
                    }
                  >
                    <Icon
                      style={styles.actionButtonIcon}
                      name="plus"
                      type="material-community"
                      color="#509C96"
                      reverse={true}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor="#509C96"
                    title="Start Moment Now"
                    onPress={() => {
                      console.log("starting moment");
                      NavigationService.navigate("MomentVisualization");
                    }}
                  >
                    <Icon
                      style={styles.actionButtonIcon}
                      name="plus"
                      type="material-community"
                      color="#509C96"
                      reverse={true}
                    />
                  </ActionButton.Item>
                </ActionButton>
              )}
            </View>
          )}
          {!this.state.selected && (
            <View style={styles.selectPrompt}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#EDEDED",
                  fontFamily: "montserrat-regular"
                }}
              >
                Select a date
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    paddingBottom: 0,
    flexDirection: "column",
    backgroundColor: "#2C239A"
  },
  calendar: {
    flex: 1
  },
  dayView: {
    flex: 1
  },
  momentSummary: {
    flex: 1,
    borderTopLeftRadius: 120,
    backgroundColor: "#EFEFEF",
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 1.0,
    shadowRadius: 0,
    shadowColor: "#3E31B1"
  },
  selectPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 32
  },
  momentWidget: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
