import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import JournalEntries from "./JournalEntries";
import Moments from "./Moments";
import Gold from "./Gold";
import Badges from "./Badges";
import Profile from "./Profile";

const JournalEntriesRoute = () => <JournalEntries />;

const MomentsRoute = () => <Moments />;

const GoldRoute = () => <Gold />;

const BadgesRoute = () => <Badges />;

const ProfileRoute = () => <Profile />;

export default function Home() {
  const [index, setIndex] = useState(0);
  const routes = [
    {
      key: "journalEntries",
      title: "Journal",
      icon: "notebook",
      color: "#160C21"
    },
    { key: "moments", title: "Moments", icon: "clock", color: "#160C21" },
    {
      key: "gold",
      title: "Gold",
      icon: "treasure-chest",
      color: "#160C21"
    },
    {
      key: "badges",
      title: "Badges",
      icon: "trophy-award",
      color: "#160C21"
    },
    { key: "profile", title: "Profile", icon: "account", color: "#160C21" }
  ];

  const handleIndexChange = index => setIndex(index);

  const renderScene = BottomNavigation.SceneMap({
    journalEntries: JournalEntriesRoute,
    moments: MomentsRoute,
    gold: GoldRoute,
    badges: BadgesRoute,
    profile: ProfileRoute
  });

  return (
    <BottomNavigation
      navigationState={{ index: index, routes: routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
    />
  );
}
