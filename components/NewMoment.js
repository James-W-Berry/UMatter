import {
  Button,
  Image,
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
import NavigationService from "./NavigationService";

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
    this.setState({ isLoading: true });
    let notificationId = await this.scheduleMomentNotification();
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
          duration: this.duration,
          title: this.title,
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
          _this.saveMomentToFirebase(notificationId);
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

      console.log(scheduledMomentTime);

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
          behavior="padding"
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
                  onPress={() => {
                    this.setState({ isDateTimePickerVisible: true });
                  }}
                >
                  <View style={styles.timeContainer}>
                    <MaterialCommunityIcons
                      name="clock"
                      size={32}
                      color="white"
                    />
                    <Text style={styles.timeEntry}>
                      {this.state.readableMomentTime}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={styles.timeContainer}>
                <TextInput
                  style={styles.timeEntry}
                  onChangeText={(text) => this.setState({ duration: text })}
                  value={this.state.duration}
                  placeholder={this.state.duration}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
                <Text style={styles.timeEntryLabel}>minutes long</Text>
              </View>

              <Modal
                onBackdropPress={() =>
                  this.setState({ isDateTimePickerVisible: false })
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
                        this.setState({ isDateTimePickerVisible: false });
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
                        this.setState({ isDateTimePickerVisible: false });
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
              <View style={{ flex: 3 }} />
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
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  headingInput: {
    flex: 1,
    width: "100%",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "montserrat-regular",
    color: "#EFEFEF",
  },
  timeContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  timeEntry: {
    margin: 10,
    textAlign: "center",
    color: "#EFEFEF",
    fontFamily: "montserrat-regular",
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    padding: 15,
  },
  timeEntryLabel: {
    margin: 10,
    textAlign: "center",
    color: "#EFEFEF",
    fontFamily: "montserrat-regular",
    fontSize: 20,
    marginLeft: 0,
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
