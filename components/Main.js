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
import * as firebase from "firebase";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";

const MainNavigator = createStackNavigator({
  SignInPage: {
    screen: SignInPage,
    navigationOptions: {
      header: null
    }
  },
  SignUpPage: {
    screen: SignUpPage
  },
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
      hasCheckedAsyncStorage: false,
      isLoggedIn: false,
      isLoading: true
    };
  }

  async componentWillMount() {
    const isFirstLaunch = await checkIfFirstLaunch();
    this.setState({ isFirstLaunch, hasCheckedAsyncStorage: true });
    let _this = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        _this.setState({ isLoggedIn: true });
        _this.setState({ isLoading: false });
        NavigationService.navigate("Home");
      } else {
        _this.setState({ isLoggedIn: false });
        _this.setState({ isLoading: false });
        NavigationService.navigate("SignInPage");
      }
    });
  }

  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default Main;
