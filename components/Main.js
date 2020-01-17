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
import checkIfFirstLaunch from "./utils/checkIfFirstLaunch";

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
      isFirstLaunch: false,
      hasCheckedAsyncStorage: false
    };
  }

  async componentWillMount() {
    const isFirstLaunch = await checkIfFirstLaunch();
    this.setState({ isFirstLaunch, hasCheckedAsyncStorage: true });
  }

  render() {
    console.log(this.state);
    const { hasCheckedAsyncStorage, isFirstLaunch } = this.state;
    if (!hasCheckedAsyncStorage) {
      return null;
    }

    return isFirstLaunch ? (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
          NavigationService.navigate("LandingPage");
        }}
      />
    ) : (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
          NavigationService.navigate("Home");
        }}
      />
    );
  }
}

export default Main;
