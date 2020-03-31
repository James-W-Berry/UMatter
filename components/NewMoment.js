import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import uuid from "uuid";
import NavigationService from "./NavigationService";
import firebase from "../firebase";
import DateTimePicker from "react-native-modal-datetime-picker";
import { CheckBox } from "react-native-elements";
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

export default class NewMoment extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: (
        <View style={styles.headerRightContainer}>
          <Text style={styles.save} onPress={() => state.params.handleSave()}>
            Save
          </Text>
        </View>
      )
    };
  };

  state = {
    timestamp: "Select Time",
    title: null,
    duration: null,
    repeating: null,

    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.saveNewMoment });
  }

  saveNewMoment = async () => {
    let { timestamp, title, duration, repeating } = this.state;
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .doc();

    const options = { year: "numeric", month: "long", day: "numeric" };
    let time = new Date(timestamp).toLocaleDateString("en-US", options);

    return docRef
      .set(
        {
          timestamp: time,
          title: title,
          duration: duration,
          repeating: repeating
        },
        { merge: true }
      )
      .then(() => {
        console.log(docRef.id);
        console.log(`successfully created moment ${docRef.id}`);
        _this.updateTotalMoments(1);
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  updateTotalMoments = async value => {
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    docRef.set(
      {
        totalMoments: firebase.firestore.FieldValue.increment(value)
      },
      { merge: true }
    );
  };

  toggleDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: !this.state.isDateTimePickerVisible
    });
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.setState({ timestamp: date.toLocaleDateString() });
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
          <View style={styles.container}>
            <View style={styles.headingContainer}>
              <TextInput
                style={styles.headingInput}
                placeholder="Add title"
                onChangeText={text => this.setState({ title: text })}
                value={this.state.title}
                numberOfLines={2}
              />
            </View>

            <View style={styles.headingContainer}>
              <TouchableOpacity onPress={this.toggleDateTimePicker}>
                <Text>{this.state.timestamp}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.toggleDateTimePicker}
                mode="datetime"
                isDarkModeEnabled={true}
              />
            </View>

            <View style={styles.repeatingOptionsContainer}>
              <Text>Repeating</Text>
              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={sundayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={sundayCheckedIcon} />
                }
                checked={this.state.sunday}
                onPress={() => this.setState({ sunday: !this.state.sunday })}
              />

              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={mondayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={mondayCheckedIcon} />
                }
                checked={this.state.monday}
                onPress={() => this.setState({ monday: !this.state.monday })}
              />
              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={tuesdayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={tuesdayCheckedIcon} />
                }
                checked={this.state.tuesday}
                onPress={() => this.setState({ tuesday: !this.state.tuesday })}
              />
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
            <View style={styles.repeatingOptionsContainer}>
              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={thursdayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={thursdayCheckedIcon} />
                }
                checked={this.state.thursday}
                onPress={() =>
                  this.setState({ thursday: !this.state.thursday })
                }
              />
              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={fridayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={fridayCheckedIcon} />
                }
                checked={this.state.friday}
                onPress={() => this.setState({ friday: !this.state.friday })}
              />
              <CheckBox
                uncheckedIcon={
                  <Image style={styles.checkbox} source={saturdayIcon} />
                }
                checkedIcon={
                  <Image style={styles.checkbox} source={saturdayCheckedIcon} />
                }
                checked={this.state.saturday}
                onPress={() =>
                  this.setState({ saturday: !this.state.saturday })
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  banner: {
    backgroundColor: "#d1d1d1",
    flex: 4,
    justifyContent: "center"
  },
  pickImageText: {
    fontSize: 16,
    color: "rgba(0, 122, 255,1.0)",
    alignSelf: "center"
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  save: {
    color: "rgba(0, 122, 255,1.0)",
    fontSize: 18,
    padding: 15,
    marginRight: 10
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: "#fff4"
  },
  headingContainer: {
    backgroundColor: "#f7f7f8",
    display: "flex",
    flex: 1,
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  repeatingOptionsContainer: {
    backgroundColor: "#f7f7f8",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  checkbox: {
    width: 30,
    height: 30
  },
  headingInput: {
    flex: 1,
    fontSize: 24,
    margin: 8,
    fontFamily: "montserrat-regular"
  },
  entryContainer: {
    backgroundColor: "#ededed",
    flex: 8,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1
  },
  entryInput: {
    flex: 1,
    fontSize: 16,
    margin: 8,
    fontFamily: "montserrat-regular"
  }
});
