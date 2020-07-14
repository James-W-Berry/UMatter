import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableHighlight,
  Alert,
  Picker,
  Platform,
} from "react-native";
import React, { Component } from "react";
import firebase from "../firebase";
import { CheckBox, Input } from "react-native-elements";
import sundayIcon from "../assets/sunday.png";
import sundayCheckedIcon from "../assets/sunday_checked.png";
import mondayIcon from "../assets/monday.png";
import mondayCheckedIcon from "../assets/monday_checked.png";
import tuesdayIcon from "../assets/tuesday.png";
import tuesdayCheckedIcon from "../assets/tuesday_checked.png";
import wednesdayIcon from "../assets/wednesday.png";
import wednesdayCheckedIcon from "../assets/wednesday_checked.png";
import thursdayIcon from "../assets/thursday.png";
import thursdayCheckedIcon from "../assets/thursday_checked.png";
import fridayIcon from "../assets/friday.png";
import fridayCheckedIcon from "../assets/friday_checked.png";
import saturdayIcon from "../assets/saturday.png";
import saturdayCheckedIcon from "../assets/saturday_checked.png";
import { Notifications } from "expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class NewMoment extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    readableMomentTime: "Set time",
    title: null,
    duration: "5",
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    isLoading: false,
    isDateTimePickerVisible: false,
    isAndroidDatePickerVisible: false,
    isAndroidTimePickerVisible: false,
  };

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: (
        <View style={styles.headerRightContainer}>
          <Text style={styles.save} onPress={() => state.params.handleSave()}>
            Save
          </Text>
        </View>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.saveNewMoment });
    var coeff = 1000 * 60 * 1;
    let now = new Date();
    let nowEpoch = new Date(Math.floor(now.getTime() / coeff) * coeff);
    this.setState({ scheduledMomentTime: nowEpoch });
  }

  saveNewMoment = async () => {
    if (this.state.title && this.state.scheduledMomentTime !== null) {
      this.setState({ isLoading: true });
      let notificationId = await this.scheduleMomentNotification();
    } else {
      Alert.alert(
        "Cannot Save",
        "Please enter a title and time for your moment",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  scheduleMomentNotification = async () => {
    let { scheduledMomentTime, title } = this.state;
    let _this = this;
    console.log(title);

    if (scheduledMomentTime) {
      const notification = {
        title: title,
        body: "Start your moment now!",
        data: {
          duration: _this.state.duration,
          title: title,
        },
        android: {
          sound: true,
        },
        ios: {
          sound: true,
        },
      };

      const schedulingOptions = {
        time: scheduledMomentTime,
      };

      Notifications.scheduleLocalNotificationAsync(
        notification,
        schedulingOptions
      )
        .then((notificationId) => {
          _this.setState({ notificationId: notificationId });
          console.log(`scheduled moment notification ${notificationId}`);
          _this.saveMomentToFirebase(notificationId.toString());
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      return null;
    }
  };

  saveMomentToFirebase = (notificationId) => {
    let moment = this.state;
    let _this = this;

    const userId = firebase.auth().currentUser.uid;

    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .doc(notificationId);

    return docRef
      .set(
        {
          ...moment,
        },
        { merge: true }
      )
      .then(() => {
        console.log(`successfully created moment ${docRef.id}`);
        _this.setState({ isLoading: false });
        _this.props.navigation.state.params.onGoBack();
        _this.props.navigation.goBack(null);
      })

      .catch(function (error) {
        console.log(error);
      });
  };

  toggleDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: !this.state.isDateTimePickerVisible,
      isAndroidDatePickerVisible: false,
    });
  };

  toggleAndroidDatePicker = () => {
    this.setState({
      isAndroidDatePickerVisible: !this.state.isAndroidDatePickerVisible,
      isDateTimePickerVisible: false,
    });
  };

  toggleAndroidTimePicker = () => {
    this.setState({
      isAndroidTimePickerVisible: !this.state.isAndroidTimePickerVisible,
      isDateTimePickerVisible: false,
    });
  };

  format12HrTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  handleChange = (event, date) => {
    if (date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let scheduledMomentTime = new Date(date);

      // get easily readable moment time
      let readableMomentTime = `${
        monthNames[scheduledMomentTime.getMonth()]
      } ${scheduledMomentTime.getDate()} at ${this.format12HrTime(
        scheduledMomentTime
      )}`;

      this.setState({ scheduledMomentTime: scheduledMomentTime });
      this.setState({
        timeZoneOffset: scheduledMomentTime.getTimezoneOffset() * 60 * 1000,
      });
      this.setState({ readableMomentTime: readableMomentTime });
    }
  };

  handleAndroidDateChange = (event, date) => {
    if (event.type == "set") {
      this.toggleAndroidDatePicker();
      this.toggleAndroidTimePicker();
    }

    if (date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let scheduledMomentTime = new Date(date);

      // get easily readable moment time
      let readableMomentTime = `${
        monthNames[scheduledMomentTime.getMonth()]
      } ${scheduledMomentTime.getDate()} at ${this.format12HrTime(
        scheduledMomentTime
      )}`;

      this.setState({ scheduledMomentTime: scheduledMomentTime });
      this.setState({
        timeZoneOffset: scheduledMomentTime.getTimezoneOffset() * 60 * 1000,
      });
      this.setState({ readableMomentTime: readableMomentTime });
    }
  };

  handleAndroidTimeChange = (event, date) => {
    if (event.type == "set") {
      this.toggleAndroidTimePicker();
    }

    if (date) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let scheduledMomentTime = new Date(date);

      // get easily readable moment time
      let readableMomentTime = `${
        monthNames[scheduledMomentTime.getMonth()]
      } ${scheduledMomentTime.getDate()} at ${this.format12HrTime(
        scheduledMomentTime
      )}`;

      this.setState({ scheduledMomentTime: scheduledMomentTime });
      this.setState({
        timeZoneOffset: scheduledMomentTime.getTimezoneOffset() * 60 * 1000,
      });
      this.setState({ readableMomentTime: readableMomentTime });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="height"
          enabled
        >
          {this.state.isLoading ? (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#509C96" />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.pageLabelContainer}>
                <Text style={styles.pageLabelText}>
                  Schedule a moment of silence
                </Text>
              </View>
              <View style={styles.headingContainer}>
                <TextInput
                  style={styles.headingInput}
                  value={this.state.title}
                  placeholder="Moment title"
                  numberOfLines={1}
                  placeholderTextColor="#EFEFEF80"
                  onChangeText={(text) => this.setState({ title: text })}
                />
              </View>

              <View style={styles.timeContainer}>
                <TouchableHighlight
                  style={styles.setTimeContainer}
                  onPress={() => {
                    this.setState({
                      isDateTimePickerVisible: true,
                      isAndroidDatePickerVisible: true,
                    });
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      width: "70%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock"
                      size={32}
                      color="white"
                    />
                    <Text style={styles.timeInput}>
                      {this.state.readableMomentTime}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.setDurationContainer}
                  onPress={() => {
                    this.refs.durationInput.focus();
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      width: "70%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      ref="durationInput"
                      maxLength={3}
                      style={styles.timeInput}
                      onChangeText={(text) => {
                        this.setState({ duration: text });
                      }}
                      onSubmitEditing={(event) => {
                        console.log(event.nativeEvent.text);
                        console.log(event.nativeEvent.text.length);

                        if (event.nativeEvent.text.length < 1) {
                          this.setState({ duration: "5" });
                        }
                      }}
                      value={this.state.duration}
                      placeholder={this.state.duration}
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                    <Text style={styles.durationLabel}>minutes long</Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={{ flex: 6 }} />

              {Platform.OS == "ios" && (
                <Modal
                  onBackdropPress={() =>
                    this.setState({
                      isDateTimePickerVisible: false,
                      isAndroidDatePickerVisible: false,
                    })
                  }
                  isVisible={this.state.isDateTimePickerVisible}
                  animationIn="slideInUp"
                  animationOut="slideOutDown"
                  coverScreen={false}
                >
                  <View style={styles.content}>
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                      }}
                    >
                      <Text style={styles.contentTitle}>Schedule Moment</Text>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flex: 4,
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <DateTimePicker
                        is24Hour={false}
                        display="default"
                        onChange={this.handleChange}
                        onCancel={this.toggleDateTimePicker}
                        mode="datetime"
                        value={this.state.scheduledMomentTime}
                      />
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableHighlight
                        onPress={() => {
                          this.setState({
                            isDateTimePickerVisible: false,
                            isAndroidDatePickerVisible: false,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "montserrat-regular",
                            padding: 20,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        onPress={() => {
                          this.setState({
                            isDateTimePickerVisible: false,
                            isAndroidDatePickerVisible: false,
                          });
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "montserrat-regular",
                            padding: 20,
                          }}
                        >
                          Ok
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              )}
              {this.state.isAndroidDatePickerVisible && (
                <View
                  style={{
                    display: "flex",
                    flex: 4,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <DateTimePicker
                    is24Hour={false}
                    display="default"
                    onChange={this.handleAndroidDateChange}
                    onCancel={this.toggleAndroidTimePicker}
                    mode={"date"}
                    value={new Date()}
                  />
                </View>
              )}
              {this.state.isAndroidTimePickerVisible && (
                <View
                  style={{
                    display: "flex",
                    flex: 4,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <DateTimePicker
                    is24Hour={false}
                    display="default"
                    onChange={this.handleAndroidTimeChange}
                    onCancel={this.toggleAndroidTimePicker}
                    mode={"time"}
                    value={new Date()}
                  />
                </View>
              )}

              {/* 
              <View style={styles.repeatingOptionsContainer}>
                <View style={styles.repeatingHeader}>
                  <Text style={styles.text}>Repeating options</Text>
                </View>
                <View style={styles.repeatingDays}>
                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={sundayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={sundayCheckedIcon}
                        />
                      }
                      checked={this.state.sunday}
                      onPress={() => {
                        this.setState({ sunday: !this.state.sunday });
                      }}
                    />
                  </View>

                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={mondayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={mondayCheckedIcon}
                        />
                      }
                      checked={this.state.monday}
                      onPress={() =>
                        this.setState({ monday: !this.state.monday })
                      }
                    />
                  </View>

                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={tuesdayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={tuesdayCheckedIcon}
                        />
                      }
                      checked={this.state.tuesday}
                      onPress={() =>
                        this.setState({ tuesday: !this.state.tuesday })
                      }
                    />
                  </View>

                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={wednesdayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={wednesdayCheckedIcon}
                        />
                      }
                      checked={this.state.wednesday}
                      onPress={() =>
                        this.setState({ wednesday: !this.state.wednesday })
                      }
                    />
                  </View>

                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={thursdayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={thursdayCheckedIcon}
                        />
                      }
                      checked={this.state.thursday}
                      onPress={() =>
                        this.setState({ thursday: !this.state.thursday })
                      }
                    />
                  </View>
                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={fridayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={fridayCheckedIcon}
                        />
                      }
                      checked={this.state.friday}
                      onPress={() =>
                        this.setState({ friday: !this.state.friday })
                      }
                    />
                  </View>
                  <View style={styles.repeatingItem}>
                    <CheckBox
                      uncheckedIcon={
                        <Image style={styles.checkbox} source={saturdayIcon} />
                      }
                      checkedIcon={
                        <Image
                          style={styles.checkbox}
                          source={saturdayCheckedIcon}
                        />
                      }
                      checked={this.state.saturday}
                      onPress={() =>
                        this.setState({ saturday: !this.state.saturday })
                      }
                    />
                  </View>
                </View>
              </View>
              */}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2C239A",
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  save: {
    color: "#509C96",
    fontSize: 18,
    padding: 15,
    marginRight: 10,
  },
  pageLabelContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pageLabelText: {
    paddingTop: 15,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "montserrat-regular",
    color: "#EFEFEF",
  },
  headingContainer: {
    flex: 1,
    minHeight: "15%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlignVertical: "top",
    padding: 15,
  },
  headingInput: {
    flex: 1,
    width: "100%",
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "montserrat-regular",
    color: "#EFEFEF",
  },
  timeContainer: {
    display: "flex",
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  setTimeContainer: {
    display: "flex",
    flex: 1,
    minHeight: "15%",
    width: "70%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#509C96",
  },
  setDurationContainer: {
    display: "flex",
    flex: 1,
    width: "70%",
    minHeight: "15%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 30,
    backgroundColor: "#509C96",
  },
  timeInput: {
    color: "#EDEDED",
    margin: 0,
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
  durationLabel: {
    textAlign: "center",
    color: "#EFEFEF",
    fontFamily: "montserrat-regular",
    fontSize: 20,
    padding: 10,
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    color: "#EFEFEF",
    fontFamily: "montserrat-regular",
    fontSize: 20,
  },
  repeatingHeader: {
    display: "flex",
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  repeatingDays: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  repeatingOptionsContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 15,
  },
  repeatingItem: {
    flex: 1,
  },
  checkbox: {
    width: 30,
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  content: {
    backgroundColor: "white",
    padding: 22,
    display: "flex",
    flex: 1,
    maxHeight: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontFamily: "montserrat-regular",
    fontSize: 20,
    marginBottom: 12,
  },
});
