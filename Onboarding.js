import { Image, View } from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";

const Square = ({ isLight, selected }) => {
  let backgroundColor;
  if (isLight) {
    backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";
  } else {
    backgroundColor = selected ? "#fff" : "rgba(255, 255, 255, 0.5)";
  }
  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor
      }}
    />
  );
};

const backgroundColor = isLight => (isLight ? "blue" : "lightblue");
const color = isLight => backgroundColor(!isLight);

const Done = ({ isLight, ...props }) => (
  <Button
    title={"Done"}
    buttonStyle={{
      backgroundColor: backgroundColor(isLight)
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight)
    }}
    textStyle={{ color: color(isLight) }}
    {...props}
  />
);

const Skip = ({ isLight, skipLabel, ...props }) => (
  <Button
    title={"Skip"}
    buttonStyle={{
      backgroundColor: backgroundColor(isLight)
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70
    }}
    textStyle={{ color: color(isLight) }}
    {...props}
  >
    {skipLabel}
  </Button>
);

const Next = ({ isLight, ...props }) => (
  <Button
    title={"Next"}
    buttonStyle={{
      backgroundColor: backgroundColor(isLight)
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight)
    }}
    textStyle={{ color: color(isLight) }}
    {...props}
  />
);

class OnboardingScreens extends Component {
  render() {
    return (
      <Onboarding
        DotComponent={Square}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DoneButtonComponent={Done}
        titleStyles={{ color: "black" }} // set default color for the title
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("./assets/moment_of_silence.png")}
                style={{ width: 200, height: 280 }}
              />
            ),
            title: "Discover silence",
            subtitle: "Schedule a moment of silence and reflection"
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("./assets/journal.png")}
                style={{ width: 300, height: 280 }}
              />
            ),
            title: "Record",
            subtitle: "Journal your thoughts in the UMatter notepad"
          },
          {
            backgroundColor: "#fff",
            image: (
              <Image
                source={require("./assets/social.png")}
                style={{ width: 280, height: 340 }}
              />
            ),
            title: "Share",
            subtitle: "Share your journal entries and interact with others"
          }
        ]}
      />
    );
  }
}

export default OnboardingScreens;
