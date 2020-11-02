import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { Image } from "react-native";
import Profile from "./Profile";
import Events from "./Events";
import Resources from "./Resources";

const EventsRoute = () => <Events />;
const ResourcesRoute = () => <Resources />;
const ProfileRoute = () => <Profile />;

export default function Home() {
  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: "events",
      title: "Events",
      icon: "calendar",
      color: "#160C21",
    },
    {
      key: "resources",
      title: "Resources",
      icon: () => {
        return (
          <Image
            source={
              index == 1
                ? require("../assets/umatter_white.png")
                : require("../assets/umatter_unselected.png")
            }
            style={{
              width: 20,
              height: 20,
            }}
          />
        );
      },
      color: "#160C21",
    },
    {
      key: "profile",
      title: "Profile",
      icon: "account",
      color: "#160C21",
    },
  ];

  const handleIndexChange = (index) => setIndex(index);

  const renderScene = BottomNavigation.SceneMap({
    events: EventsRoute,
    resources: ResourcesRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      // style={{ fontFamily: "montserrat-medium", color: "#191919" }}
      navigationState={{ index: index, routes: routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
    />
  );
}
