import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ReactStopwatch from "react-stopwatch";
import { TouchableOpacity } from "react-native-gesture-handler";
import NavigationService from "./NavigationService";

export default class MomentVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    this.animation.play();
  }
  increment() {
    this.setState({
      count: this.state.count + 1
    });
  }
  render() {
    return (
      <View style={styles.animationContainer}>
        <LinearGradient
          colors={["#1CB5E0", "#000046"]}
          style={{
            padding: 0,
            alignItems: "center",
            height: "100%",
            width: "100%"
          }}
        >
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: 500,
              height: 500
            }}
            source={require("./waterAnimation.json")}
          />

          <ReactStopwatch
            seconds={0}
            minutes={0}
            hours={0}
            limit="01:00:00"
            onChange={({ hours, minutes, seconds }) => {
              // do something
            }}
            onCallback={() => console.log("Finish")}
            render={({ formatted, hours, minutes, seconds }) => {
              return (
                <View>
                  <Text
                    style={{ color: "#efefef" }}
                  >{`${minutes}:${seconds}`}</Text>
                </View>
              );
            }}
          />

          <TouchableOpacity
            style={styles.finishMoment}
            onPress={() => {
              NavigationService.navigate("NewJournalEntry");
            }}
          >
            <Text style={{ fontSize: 20 }} placeholder="Done">
              Done
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", flex: 1 },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  finishMoment: {
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#efefef",
    padding: 15,
    marginTop: 5,
    borderRadius: 10
  }
});
