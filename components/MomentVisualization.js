import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Countdown from "react-countdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import NavigationService from "./NavigationService";
import * as firebase from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default class MomentVisualization extends Component {
  constructor(props) {
    super(props);

    const db = firebase.firestore();
    var userId = firebase.auth().currentUser.uid;

    this.state = {
      count: 0,
      firestore: db,
      userId: userId,
      title: props.navigation.state.params.title,
      duration: props.navigation.state.params.duration,
    };
  }

  componentDidMount() {
    var userDocRef = this.state.firestore
      .collection("users")
      .doc(this.state.userId);
    userDocRef
      .set(
        {
          status: "inMoment",
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully updated user status to inMoment");
      })
      .catch(function (error) {
        console.log(error);
      });

    this.animation.play();
  }

  componentWillUnmount() {
    var userDocRef = this.state.firestore
      .collection("users")
      .doc(this.state.userId);
    userDocRef
      .set(
        {
          status: "active",
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully updated user status to not inMoment");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // increment() {
  //   this.setState({
  //     count: this.state.count + 1,
  //   });
  // }

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
        console.log("incremented totalMoments by 1");
        _this.setState({ isLoading: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              color: "#EDEDED",
              fontSize: 24,
              fontFamily: "montserrat-regular",
              padding: 10,
            }}
          >
            Nice Job!
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
              }}
              onPress={() => {
                this.updateTotalMoments(1);
                NavigationService.navigate("NewJournalEntry", {
                  onGoBack: () => {
                    "coming back to MomentVisualization from NewJournalEntry";
                    NavigationService.pop(2);
                  },
                });
              }}
            >
              <Text
                style={{
                  color: "#EDEDED",
                  fontSize: 24,
                  fontFamily: "montserrat-regular",
                  padding: 10,
                  textAlign: "center",
                }}
              >
                Let's finish by recording your thoughts
              </Text>
              <MaterialCommunityIcons
                style={{ alignSelf: "center" }}
                name="arrow-right"
                size={35}
                color="#EDEDED"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              color: "#EDEDED",
              fontSize: 24,
              fontFamily: "montserrat-regular",
            }}
          >
            {minutes}:{seconds}
          </Text>
          <TouchableOpacity
            style={styles.finishMoment}
            onPress={() => {
              this.updateTotalMoments(1);
              NavigationService.navigate("NewJournalEntry", {
                onGoBack: () => {
                  console.log(
                    "coming back to MomentVisualization from NewJournalEntry"
                  );
                  NavigationService.pop(2);
                },
              });
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontFamily: "montserrat-regular",
              }}
              placeholder="Done"
            >
              Finish Early
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#1CB5E0", "#000046"]}
          style={{
            padding: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <View style={styles.headingContainer}>
            <Text
              style={{
                color: "#EDEDED",
                fontSize: 30,
                fontFamily: "montserrat-regular",
              }}
            >
              {this.state.title}
            </Text>
          </View>

          <View style={styles.animationContainer}>
            <LottieView
              ref={(animation) => {
                this.animation = animation;
              }}
              style={{ width: "100%", height: "100%" }}
              source={require("./waterAnimation.json")}
            />
          </View>

          <View style={styles.timerContainer}>
            <Countdown
              date={Date.now() + this.state.duration * 60 * 1000}
              intervalDelay={0}
              renderer={this.renderer}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  headingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  finishMoment: {
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#efefef",
    padding: 15,
    marginTop: 5,
    borderRadius: 10,
  },
});
