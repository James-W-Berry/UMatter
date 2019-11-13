import React, { Component } from "react";
import LandingPage from "./LandingPage";
import { View } from "react-native";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeCheck: true
    };
  }

  render() {
    if (this.state.firstTimeCheck) {
      return <LandingPage />;
    }
  }
}

export default Main;
