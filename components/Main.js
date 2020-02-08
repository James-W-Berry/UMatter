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
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

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
      } else {
        _this.setState({ isLoggedIn: false });
        _this.setState({ isLoading: false });
      }
    });
  }

  createNewUser(email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });
  }

  render() {
    const { hasCheckedAsyncStorage, isFirstLaunch } = this.state;

    return this.state.isLoading ? (
      <Text>Loading</Text>
    ) : !hasCheckedAsyncStorage ? null : isFirstLaunch ? (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
          NavigationService.navigate("LandingPage");
        }}
      />
    ) : this.state.isLoggedIn ? (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
          NavigationService.navigate("Home");
        }}
      />
    ) : (
      <View>
        <TextInput
          label="Email"
          onChangeText={text => this.setState({ email: text })}
        ></TextInput>
        <TextInput
          label="Password"
          onChangeText={text => this.setState({ password: text })}
        ></TextInput>

        <Button
          onPress={() =>
            this.createNewUser(this.state.email, this.state.password)
          }
        >
          Create New Account
        </Button>
      </View>
    );
  }
}

export default Main;
