import React from "react";
import OnboardingScreens from "./Onboarding";
import LandingPage from "./LandingPage";
import Home from "./Home";
import JournalEntries from "./JournalEntries";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import NavigationService from "./NavigationService";
import NewJournalEntry from "./NewJournalEntry";
import JournalEntry from "./JournalEntry";
import NewMoment from "./NewMoment";
import EditMoment from "./EditMoment";
import MomentVisualization from "./MomentVisualization";
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
    screen: SignUpPage,
    navigationOptions: {
      headerStyle: { backgroundColor: "#2C239A" },
      headerTitleStyle: { color: "#509C96" },
      headerTintColor: "#509C96"
    }
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
  NewMoment: {
    screen: NewMoment,
    navigationOptions: {
      headerStyle: { backgroundColor: "#2C239A" },
      headerTitleStyle: { color: "#509C96" },
      headerTintColor: "#509C96"
    }
  },
  EditMoment: {
    screen: EditMoment
  },
  MomentVisualization: {
    screen: MomentVisualization
  }
});

const AppContainer = createAppContainer(MainNavigator);

function Main() {
  return (
    <AppContainer
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
}

export default Main;
