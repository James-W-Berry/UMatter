import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { Text, View, Icon, Image } from "react-native";
import Profile from "./Profile";
import Events from "./Events";
import Resources from "./Resources";
import umatterIcon from "../assets/icon.png";

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
            source={require("../assets/umatter_orange.png")}
            style={{
              width: 15,
              height: 15,
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
      navigationState={{ index: index, routes: routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
    />
  );
}
