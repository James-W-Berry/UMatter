import React, { Component } from "react";
import OnboardingScreens from "./Onboarding";
import LandingPage from "./LandingPage";
import Home from "./Home";
import JournalEntries from "./JournalEntries";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import NavigationService from "./NavigationService";

const MainNavigator = createStackNavigator(
  {
    LandingPage: { screen: LandingPage },
    Onboarding: { screen: OnboardingScreens },
    Home: { screen: Home },
    JournalEntries: { screen: JournalEntries }
  },
  {
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(MainNavigator);

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeCheck: false
    };
  }

  render() {
    if (this.state.firstTimeCheck) {
      return (
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
            NavigationService.navigate("LandingPage");
          }}
        />
      );
    } else {
      return (
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
            NavigationService.navigate("Home");
          }}
        />
      );
    }
  }
}

export default Main;
