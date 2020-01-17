import { Image, Text, View, StyleSheet, ImageBackground } from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";
import NavigationService from "./NavigationService";

class LandingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/deep_sea_space.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={styles.banner}>
            <Image
              source={require("../assets/umatter_banner.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.bottom}>
            <Button
              title={"Start the Tour"}
              buttonStyle={styles.button}
              onPress={() => NavigationService.navigate("Onboarding")}
            />
          </View>

          <View style={styles.buildInfo}>
            <Text>Build Version 0.0.3</Text>
            <Text>January 17, 2020</Text>
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
  banner: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "28%"
  },
  bottom: {
    flex: 1,
    justifyContent: "center"
  },
  buildInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#44CADD"
  }
});

export default LandingPage;
