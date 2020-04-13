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

export default class NewMoment extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    readableMomentTime: "Set a time",
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
    this.props.navigation.setParams({ handleSave: this.saveNewMoment });
    var coeff = 1000 * 60 * 1;
    let now = new Date();
    let nowEpoch = new Date(Math.floor(now.getTime() / coeff) * coeff);
    this.setState({ scheduledMomentTime: nowEpoch });
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
    let { scheduledMomentTime, title } = this.state;
    let _this = this;
    console.log(title);

    if (scheduledMomentTime) {
      const notification = {
        title: title,
        body: "Start your moment now!",
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
                  <Text style={styles.text}>
                    {this.state.readableMomentTime}
                  </Text>
                </TouchableHighlight>
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
