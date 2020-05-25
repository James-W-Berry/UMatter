import React, { useState } from "react";
import { Button } from "react-native-elements";
import firebase from "../firebase";
import "firebase/auth";
import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationService from "./NavigationService";

export default function ForgottenPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onResetPassword(email) {
    setIsLoading(true);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setIsLoading(false);
        Alert.alert(
          "Reset Link Sent",
          "Please check your email",
          [
            {
              text: "OK",
              onPress: () => {
                setEmail("");
                NavigationService.navigate("SignInPage");
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch(function (error) {
        setIsLoading(false);
        Alert.alert("No user found with that email");
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
          Forgotten Password
        </Text>
      </View>

      <View style={styles.formSection}>
        <MaterialCommunityIcons name="email" size={32} color="white" />

        <TextInput
          value={email}
          onChangeText={(email) => setEmail(email)}
          placeholder="email to send reset instructions"
          autoCompleteType="email"
          keyboardType="email-address"
          placeholderTextColor="#ededed80"
          underlineColorAndroid="transparent"
          style={styles.input}
        />
      </View>

      {isLoading ? (
        <View style={[styles.signUpSpinner, styles.horizontal]}>
          <ActivityIndicator size="large" color="#509C96" />
        </View>
      ) : (
        <View style={styles.forgotPasswordButton}>
          <Button
            title={"Reset Password"}
            titleStyle={{
              fontFamily: "montserrat-regular",
              justifyContent: "center",
            }}
            buttonStyle={styles.button}
            onPress={() => onResetPassword(email)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#2C239A",
  },
  header: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderBottomColor: "#EDEDED",
    borderBottomWidth: 1,
    width: "70%",
    color: "#EDEDED",
    margin: 10,
    padding: 10,
    fontSize: 16,
    fontFamily: "montserrat-regular",
  },
  formSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  forgotPasswordButton: {
    flex: 3,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#509C96",
    borderRadius: 30,
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
});
