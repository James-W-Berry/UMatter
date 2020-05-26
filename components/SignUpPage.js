import {
  Alert,
  TextInput,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-elements";
import NavigationService from "./NavigationService";
import * as firebase from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSignUp(username, email, password) {
    setIsLoading(true);
    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        var userId = firebase.auth().currentUser.uid;

        db.collection("users")
          .doc(userId)
          .set({
            username: username,
          })
          .catch(function (error) {
            setIsLoading(false);
            console.log(error);
          });
        console.log("sign up successful");
        NavigationService.navigate("Onboarding");
      })
      .catch(function (error) {
        setIsLoading(false);
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
        Alert.alert(errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} translucent={true} />
      <View style={styles.header}>
        <Text
          style={{
            fontSize: 24,
            color: "#EDEDED",
            fontFamily: "montserrat-regular",
          }}
        >
          Sign Up
        </Text>
      </View>

      <View style={styles.searchSection}>
        <MaterialCommunityIcons name="account" size={32} color="white" />

        <TextInput
          style={{
            borderBottomColor: "#EDEDED",
            borderBottomWidth: 1,
            width: "70%",
            color: "#EDEDED",
            margin: 10,
            padding: 0,
            fontSize: 16,
            fontFamily: "montserrat-regular",
          }}
          placeholder="Username"
          placeholderTextColor="#ededed80"
          onChangeText={(text) => setUsername(text)}
          underlineColorAndroid="transparent"
          value={username}
        />
      </View>

      <View style={styles.searchSection}>
        <MaterialCommunityIcons name="email" size={32} color="white" />

        <TextInput
          style={{
            borderBottomColor: "#EDEDED",
            borderBottomWidth: 1,
            width: "70%",
            color: "#EDEDED",
            margin: 10,
            padding: 0,
            fontSize: 16,
            fontFamily: "montserrat-regular",
          }}
          placeholder="Email"
          autoCompleteType="email"
          placeholderTextColor="#ededed80"
          onChangeText={(text) => setEmail(text)}
          underlineColorAndroid="transparent"
          value={email}
        />
      </View>

      <View style={styles.searchSection}>
        <MaterialCommunityIcons name="account-key" size={32} color="white" />

        <TextInput
          style={{
            borderBottomColor: "#ededed",
            borderBottomWidth: 1,
            width: "70%",
            color: "#EDEDED",
            margin: 10,
            fontSize: 16,
            fontFamily: "montserrat-regular",
          }}
          placeholder="Password"
          autoCompleteType="password"
          secureTextEntry={true}
          placeholderTextColor="#ededed80"
          onChangeText={(text) => setPassword(text)}
          underlineColorAndroid="transparent"
          value={password}
        />
      </View>

      {isLoading ? (
        <View style={[styles.signUpSpinner, styles.horizontal]}>
          <ActivityIndicator size="large" color="#509C96" />
        </View>
      ) : (
        <View style={styles.signUpButton}>
          <Button
            title={"Create New Account"}
            titleStyle={{
              fontFamily: "montserrat-regular",
              justifyContent: "center",
            }}
            buttonStyle={styles.button}
            onPress={() => onSignUp(username, email, password)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2C239A",
  },
  signUpSpinner: {
    flex: 3,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  header: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 2,
    justifyContent: "center",
  },
  signUpButton: {
    flex: 3,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
  },
  signUp: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#509C96",
    borderRadius: 30,
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  input: {
    flex: 1,
    backgroundColor: "#00000000",
    color: "#EDEDED",
  },
});
