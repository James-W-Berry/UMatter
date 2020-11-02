import React from "react";
import OnboardingScreens from "./Onboarding";
import LandingPage from "./LandingPage";
import Home from "./Home";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import NavigationService from "./NavigationService";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import ForgottenPasswordPage from "./ForgottenPasswordPage";
import Event from "./Event";

const MainNavigator = createStackNavigator({
  SignInPage: {
    screen: SignInPage,
    navigationOptions: {
      header: null,
    },
  },
  SignUpPage: {
    screen: SignUpPage,
    navigationOptions: {
      headerStyle: { backgroundColor: "#2C239A" },
      headerTitleStyle: { color: "#509C96" },
      headerTintColor: "#509C96",
    },
  },
  ForgottenPasswordPage: {
    screen: ForgottenPasswordPage,
    navigationOptions: {
      headerStyle: { backgroundColor: "#2C239A" },
      headerTitleStyle: { color: "#509C96" },
      headerTintColor: "#509C96",
    },
  },
  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      header: null,
    },
  },
  Onboarding: {
    screen: OnboardingScreens,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
  Event: {
    screen: Event,
    navigationOptions: {
      headerStyle: { backgroundColor: "#2C239A" },
      headerTitleStyle: { color: "#509C96" },
      headerTintColor: "#509C96",
    },
  },
});

const AppContainer = createAppContainer(MainNavigator);

function Main() {
  return (
    <AppContainer
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
}

export default Main;
