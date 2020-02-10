import React, { Component } from "react";
import { Text, StyleSheet, Alert, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        Alert.alert("Could not sign out!");
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{firebase.auth().currentUser.metadata.creationTime}</Text>
        <Text>{firebase.auth().currentUser.metadata.lastSignInTime}</Text>
        <Text>{firebase.auth().currentUser.email}</Text>
        <Text>{firebase.auth().currentUser.uid}</Text>

        <Button title={"Sign Out"} onPress={() => this.signOut()} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
