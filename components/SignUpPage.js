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

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  createNewUser(email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function() {
        console.log("sign up successful, navigating to Home");
        NavigationService.navigate("Home");
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
        Alert.alert(errorMessage);
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
            <Text style={{ fontSize: 24, color: "#EDEDED" }}>Sign Up</Text>
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

          <View style={styles.signUpButton}>
            <Button
              title={"Create New Account"}
              buttonStyle={styles.button}
              onPress={() =>
                this.createNewUser(this.state.email, this.state.password)
              }
            />
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
  signUpButton: {
    flex: 3,
    width: "100%",
    justifyContent: "center",
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

export default SignUpPage;
