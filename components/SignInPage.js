import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  TextInput
} from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";
import NavigationService from "./NavigationService";
import * as firebase from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class SignInPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  signIn(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        NavigationService.navigate("Home");
      })
      .catch(function(error) {
        Alert.alert("Incorrect email or password, please try again");
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/deep_sea_space.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={styles.header}>
            <Text style={{ fontSize: 24, color: "#EDEDED" }}>Sign In</Text>
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
                fontSize: 20
              }}
              placeholder="Email"
              placeholderTextColor="#ededed80"
              onChangeText={text => this.setState({ email: text })}
              underlineColorAndroid="transparent"
              value={this.state.email}
            />
          </View>

          <View style={styles.searchSection}>
            <MaterialCommunityIcons
              name="account-key"
              size={32}
              color="white"
            />

            <TextInput
              style={{
                borderBottomColor: "#ededed",
                borderBottomWidth: 1,
                width: "70%",
                color: "#EDEDED",
                margin: 10,
                fontSize: 20
              }}
              placeholder="Password"
              placeholderTextColor="#ededed80"
              onChangeText={text => this.setState({ password: text })}
              underlineColorAndroid="transparent"
              value={this.state.password}
            />
          </View>

          <View style={styles.signInButton}>
            <Button
              title={"Sign In"}
              buttonStyle={styles.button}
              onPress={() => this.signIn(this.state.email, this.state.password)}
            />
          </View>

          <View style={styles.signUp}>
            <Text style={{ color: "#EDEDED" }}>Don't have an account? </Text>
            <Text
              style={{ color: "#EDEDED", fontWeight: "bold" }}
              onPress={() => NavigationService.navigate("SignUpPage")}
            >
              Sign Up
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  header: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  banner: {
    flex: 2,
    justifyContent: "center"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  bottom: {
    flex: 2,
    justifyContent: "center"
  },
  signInButton: {
    flex: 3,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  signUp: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    alignSelf: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#44CADD"
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000"
  },
  input: {
    flex: 1,
    backgroundColor: "#00000000",
    color: "#EDEDED"
  }
});

export default SignInPage;
