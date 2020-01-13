import React, { Component } from "react";
import LottieView from "lottie-react-native";

export default class MomentVisualization extends Component {
  render() {
    return <LottieView source={require("./momentUI.json")} autoPlay loop />;
  }
}
