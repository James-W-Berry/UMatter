import React, { Component } from "react";
import Main from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
