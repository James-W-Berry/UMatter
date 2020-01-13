import React, { Component } from "react";
import OnboardingScreens from "./Onboarding";
import LandingPage from "./LandingPage";
import Home from "./Home";
import JournalEntries from "./JournalEntries";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import NavigationService from "./NavigationService";
import NewJournalEntry from "./NewJournalEntry";
import JournalEntry from "./JournalEntry";
import MomentVisualization from "./MomentVisualization";

const MainNavigator = createStackNavigator({
  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      header: null
    }
  },
  Onboarding: {
    screen: OnboardingScreens,
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  JournalEntries: {
    screen: JournalEntries,
    navigationOptions: {
      header: null
    }
  },
  NewJournalEntry: {
    screen: NewJournalEntry
  },
  JournalEntry: {
    screen: JournalEntry
  },
  MomentVisualization: {
    screen: MomentVisualization
  }
});

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
