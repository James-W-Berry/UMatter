import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import { Notifications } from "expo";

export default class MomentWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.props.moment,
      title: this.props.moment.title,
      time: this.props.moment.time,
      id: this.props.id,
      isDateTimePickerVisible: false,
      showMomentEditor: false,
      widgetHeight: "100%"
    };
  }

  componentDidMount() {
    this.scheduleMomentNotification();
  }

  scheduleMomentNotification = () => {
    const localnotification = {
      title: "UMatter",
      body: "Start your moment now!",
      data: {
        message: this.state.title
      },
      android: {
        sound: true
      },
      ios: {
        sound: true
      }
    };

    var coeff = 1000 * 60 * 1;

    let momentDate = new Date(this.state.time);
    let momentTime = new Date(Math.floor(momentDate.getTime() / coeff) * coeff);

    const schedulingOptions = {
      time: momentTime
    };

    this.cancelScheduledNotification();

    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    ).then(notificationId => {
      this.setState({ notificationId: notificationId });
      console.log(`scheduled moment notification ${notificationId}`);
    });
  };

  cancelScheduledNotification = () => {
    if (this.state.notificationId !== undefined) {
      console.log(
        `cancelling moment notification ${this.state.notificationId}`
      );
      Notifications.cancelScheduledNotificationAsync(
        this.state.notificationId
      ).catch(error => {
        console.log(error);
      });
    }
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ time: date }, () => {
      this.storeData();
      this.scheduleMomentNotification();
    });

    this.hideDateTimePicker();
  };

  editMoment = () => {
    if (this.state.showMomentEditor) {
      this.storeData();
      this.scheduleMomentNotification();
      this.setState({ widgetHeight: "200%" });
    } else {
      this.setState({ widgetHeight: "100%" });
    }
    this.setState({
      showMomentEditor: !this.state.showMomentEditor
    });
  };

  storeData = async () => {
    if (this.state.time !== null) {
      const updatedMoment = {
        title: this.state.title,
        time: this.state.time,
        id: this.state.id
      };

      if (this.state.id !== undefined) {
        await AsyncStorage.setItem(this.state.id, JSON.stringify(updatedMoment))
          .then(() => {
            console.log(`updated moment ${this.state.id} saved to storage`);
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      alert("please enter a time for your reflection");
    }
  };

  widgetStyle = function() {
    return {
      justifyContent: "center",
      flexDirection: "row",
      width: "75%",
      height: this.state.widgetHeight,
      alignSelf: "center",
      backgroundColor: "#509C96",
      padding: 15,
      marginTop: 15,
      borderRadius: 20
    };
  };

  render() {
    let date = new Date(this.state.time);
    let amOrPm = date.getHours() >= 12 ? "pm" : "am";
    let hours = date.getHours() % 12 || 12;
    let minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let formattedDate = hours + ":" + minutes + " " + amOrPm;

    return (
      <View style={this.widgetStyle()}>
        {/* <TouchableOpacity style={this.widgetStyle()} onPress={this.editMoment}>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity
              onPress={this.showDateTimePicker}
              title="Show datetime picker"
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#EFEFEF",
                  fontFamily: "montserrat-regular"
                }}
              >
                {formattedDate}
              </Text>
            </TouchableOpacity>
            {!this.state.showMomentEditor && (
              <Text
                style={{ fontSize: 16, color: "#EFEFEF" }}
                placeholder="Label"
              >
                {this.state.title}
              </Text>
            )}
          </View>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="time"
            isDarkModeEnabled={true}
          />

          <View style={styles.deleteMomentButton}>
            <TouchableOpacity
              title="Delete"
              onPress={() => {
                this.props.deleteMoment(this.state.moment.id);
                this.cancelScheduledNotification();
              }}
            >
              <Icon name="delete" type="material-community" color="#EFEFEF" />
            </TouchableOpacity>
          </View>

          <View style={styles.expandMomentButton}>
            <TouchableOpacity title="Edit" onPress={this.editMoment}>
              {this.state.showMomentEditor && (
                <Icon
                  name="chevron-up"
                  type="material-community"
                  color="#EFEFEF"
                />
              )}
              {!this.state.showMomentEditor && (
                <Icon
                  name="chevron-down"
                  type="material-community"
                  color="#EFEFEF"
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {this.state.showMomentEditor && (
          <View style={styles.editMomentWidget}>
            <TextInput
              style={styles.entryInput}
              placeholder="Label"
              placeholderTextColor="#EFEFEF"
              onChangeText={text => this.setState({ title: text })}
              value={this.state.title}
            />
          </View>
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editMomentWidget: {
    flexDirection: "column",
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#509C96",
    padding: 15
  },
  entryInput: {
    color: "#EFEFEF",
    fontFamily: "montserrat-regular"
  },
  deleteMomentButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: 15,
    alignSelf: "center",
    width: "10%"
  },
  expandMomentButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "20%",
    alignSelf: "center",
    width: "10%"
  }
});
