import React, { Component } from "react";
import OnboardingScreens from "./Onboarding";
import LandingPage from "./LandingPage";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const MainNavigator = createStackNavigator({
  LandingPage: { screen: LandingPage },
  Onboarding: { screen: OnboardingScreens }
});

const NavigationContainer = createAppContainer(MainNavigator);

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeCheck: true
    };
  }

  render() {
    if (this.state.firstTimeCheck) {
      return (
        <NavigationContainer>
          <LandingPage />;
        </NavigationContainer>
      );
    }
  }
}

export default Main;
