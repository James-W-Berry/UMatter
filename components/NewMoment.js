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
  // Modal,
  TouchableHighlight,
  Alert,
} from "react-native";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import NavigationService from "./NavigationService";
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

const options = { year: "numeric", month: "long", day: "numeric" };
let now = new Date();
let formattedDate = new Date().toLocaleDateString("en-US", options);

export default class NewMoment extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    currentTime: now,
    formattedDate: formattedDate,
    title: null,
    duration: 5,
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
    // const options = { year: "numeric", month: "long", day: "numeric" };
    // let now = new Date().toLocaleDateString("en-US", options);
    // this.setState({ timestamp: now });
    this.props.navigation.setParams({ handleSave: this.saveNewMoment });
  }

  saveNewMoment = async () => {
    this.setState({ isLoading: true });
    let notificationId = await this.scheduleMomentNotification();
    if (notificationId !== null) {
      let moment = this.state;
      let _this = this;
      const userId = firebase.auth().currentUser.uid;

      const docRef = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("moments")
        .doc();

      return docRef
        .set(
          {
            ...moment,
          },
          { merge: true }
        )
        .then(() => {
          console.log(`successfully created moment ${docRef.id}`);
          _this.updateTotalMoments(1);
        })

        .catch(function (error) {
          console.log(error);
        });
    }
  };

  scheduleMomentNotification = async () => {
    if (this.state.scheduledTimestamp) {
      const notification = {
        title: "UMatter",
        body: "Start your moment now!",
        data: {
          message: this.state.title,
        },
        android: {
          sound: true,
        },
        ios: {
          sound: true,
        },
      };

      const schedulingOptions = {
        time: this.state.scheduledTimestamp,
      };

      Notifications.scheduleLocalNotificationAsync(
        notification,
        schedulingOptions
      )
        .then((notificationId) => {
          this.setState({ notificationId: notificationId });
          console.log(`scheduled moment notification ${notificationId}`);
          return notificationId;
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      return null;
    }
  };

  updateTotalMoments = async (value) => {
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase.firestore().collection("users").doc(userId);

    docRef
      .set(
        {
          totalMoments: firebase.firestore.FieldValue.increment(value),
        },
        { merge: true }
      )
      .then(() => {
        _this.setState({ isLoading: false });
        NavigationService.navigate("Moments");
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

  handleDatePicked = (date) => {
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

    let formattedDate = `${
      monthNames[date.getMonth()]
    } ${date.getDate()} at ${this.format12HrTime(date)}`;
    let newDate = new Date(date);
    var coeff = 1000 * 60 * 1;
    let momentTime = new Date(Math.floor(newDate.getTime() / coeff) * coeff);
    let yearAndMonth = `${date.getFullYear()}_${date.getMonth() + 1}`;

    this.setState({ momentMonth: yearAndMonth });
    this.setState({ scheduledTimestamp: momentTime });
    this.setState({ timestampFormatted: formattedDate });
    this.toggleDateTimePicker();
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
              <View style={styles.headingContainer}>
                <TextInput
                  style={styles.text}
                  value={this.state.title}
                  placeholder="Add title"
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
                  <Text style={styles.text}>{this.state.formattedDate}</Text>
                </TouchableHighlight>
              </View>

              <Modal
                style={{
                  // marginTop: "40%",
                  // marginBottom: "40%",
                  backgroundColor: "#EFEFEF",
                  display: "flex",
                  flexDirection: "column",
                }}
                isVisible={this.state.isDateTimePickerVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                coverScreen={true}
              >
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#efefef",
                  }}
                >
                  <DateTimePicker
                    timeZoneOffsetInMinutes={0}
                    is24Hour={false}
                    display="default"
                    onConfirm={this.handleDatePicked}
                    onCancel={this.toggleDateTimePicker}
                    mode="datetime"
                    value={this.state.currentTime}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#1919",
                  }}
                >
                  <TouchableHighlight
                    style={{
                      flex: 1,
                      backgroundColor: "#564981",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.setState({ isDateTimePickerVisible: false });
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        fontFamily: "montserrat-regular",
                        padding: 20,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{
                      flex: 1,
                      backgroundColor: "#985667",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      this.setState({ isDateTimePickerVisible: false });
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        fontFamily: "montserrat-regular",
                        padding: 20,
                      }}
                    >
                      Ok
                    </Text>
                  </TouchableHighlight>
                </View>
              </Modal>
              <View style={styles.repeatingItem}>
                <Input
                  style={styles.text}
                  color="#EFEFEF"
                  onChangeText={(text) => this.setState({ duration: text })}
                  value={`${this.state.duration} min long`}
                  placeholder={`${this.state.duration} min long`}
                  placeholderTextColor="#EFEFEF80"
                  keyboardType={"numeric"}
                  returnKeyType="done"
                />
              </View>

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
  text: {
    justifyContent: "center",
    alignItems: "center",
    color: "#EFEFEF",
    fontFamily: "montserrat-regular",
    fontSize: 20,
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
  cancelButton: {
    marginRight: 8,
  },
  headingContainer: {
    display: "flex",
    fontSize: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headingInput: {
    flex: 1,
    fontSize: 24,
    margin: 8,
    fontFamily: "montserrat-regular",
    color: "#EFEFEF",
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    fontSize: 30,
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
  modalView: {
    width: "50%",
    height: "50%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
