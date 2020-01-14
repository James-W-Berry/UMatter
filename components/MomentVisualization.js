import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default class MomentVisualization extends Component {
  componentDidMount() {
    this.animation.play();
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
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});
