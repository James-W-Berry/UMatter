import { Image, View, StyleSheet, ImageBackground } from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";

class LandingPage extends Component {
  static navigationOptions = {
    title: "Welcome"
  };
  onButtonPress() {}
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./assets/deep_sea_space.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={styles.banner}>
            <Image
              source={require("./assets/umatter_banner.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.bottom}>
            <Button
              title={"Start the Tour"}
              buttonStyle={styles.button}
              onPress={() => navigate("Onboarding")}
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
  banner: {
    flex: 2,
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
  button: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#44CADD"
  }
});

export default LandingPage;
