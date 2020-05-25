import {
  Image,
  Text,
  View,
  StyleSheet,
  Alert,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-elements";
import NavigationService from "./NavigationService";
import * as firebase from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function signIn(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        NavigationService.navigate("Home");
      })
      .catch(function (error) {
        Alert.alert("Incorrect email or password, please try again");
      });
  }

  function resetPassword(email) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        Alert.alert("Check your email to reset your password.");
      })
      .catch(function (error) {
        Alert.alert(
          "Could not send email, please check the entered email address and try again."
        );
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
          Sign In
        </Text>
      </View>

      <View style={styles.banner}>
        <Image
          source={require("../assets/umatter_banner.png")}
          style={styles.image}
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
            fontSize: 16,
            fontFamily: "montserrat-regular",
          }}
          placeholder="Email"
          autoCompleteType="email"
          required
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
        <View style={styles.signInButton}>
          <Button
            title={"Sign In"}
            titleStyle={{
              fontFamily: "montserrat-regular",
              justifyContent: "center",
            }}
            buttonStyle={styles.button}
            onPress={() => signIn(email, password)}
          />
        </View>
      )}

      <View style={styles.forgotPassword}>
        <Text
          style={{
            color: "#509C96",
            fontWeight: "bold",
            fontFamily: "montserrat-medium",
          }}
          onPress={() => NavigationService.navigate("ForgottenPasswordPage")}
        >
          Forgot your password?
        </Text>
      </View>

      <View style={styles.signUp}>
        <Text style={{ color: "#EDEDED", fontFamily: "montserrat-regular" }}>
          Don't have an account?{" "}
        </Text>
        <Text
          style={{
            color: "#509C96",
            fontWeight: "bold",
            fontFamily: "montserrat-medium",
          }}
          onPress={() => NavigationService.navigate("SignUpPage")}
        >
          Sign Up
        </Text>
      </View>
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
  header: {
    flex: 2,
    marginTop: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    flex: 3,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottom: {
    flex: 2,
    justifyContent: "center",
  },
  signInButton: {
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
  forgotPassword: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
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
