import React, { Component } from "react";
import Main from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as firebase from "firebase";
import getEnvVars from "./environment";

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
  }

  render() {
    return (
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    );
  }
}

export default App;
