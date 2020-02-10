import React, { Component } from "react";
import Main from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as firebase from "firebase";
import getEnvVars from "./environment";
import * as Font from "expo-font";
import checkIfFirstLaunch from "./utils/checkIfFirstLaunch";
import NavigationService from "./components/NavigationService";

envVars = getEnvVars("dev");
console.log(envVars);
const firebaseConfig = {
  apiKey: envVars.API_KEY,
  authDomain: envVars.AUTH_DOMAIN,
  databaseURL: envVars.DATABASE_URL,
  projectId: envVars.PROJECT_ID,
  storageBucket: envVars.STORAGE_BUCKET,
  messagingSenderId: envVars.MESSAGING_SENDER_ID,
  appId: envVars.APP_ID,
  measurementId: envVars.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      isFirstLaunch: false,
      hasCheckedAsyncStorage: false,
      isLoggedIn: false,
      isLoading: true
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "montserrat-medium": require("./assets/fonts/Montserrat-Medium.ttf")
    });

    this.setState({ fontLoaded: true });

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
    const { fontLoaded, hasCheckedAsyncStorage, isLoading } = this.state;
    return (
      <SafeAreaProvider>
        {fontLoaded && hasCheckedAsyncStorage && !isLoading ? <Main /> : null}
      </SafeAreaProvider>
    );
  }
}

export default App;
