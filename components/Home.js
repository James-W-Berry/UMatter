import React, { Component } from "react";
import { BottomNavigation } from "react-native-paper";
import JournalEntries from "./JournalEntries";
import Moments from "./Moments";
import SmileFile from "./SmileFile";
import Badges from "./Badges";
import Profile from "./Profile";

const JournalEntriesRoute = () => <JournalEntries />;

const MomentsRoute = () => <Moments />;

const GoldRoute = () => <SmileFile />;

const BadgesRoute = () => <Badges />;

const ProfileRoute = () => <Profile />;

class Home extends Component {
  state = {
    index: 0,
    routes: [
      {
        key: "journalEntries",
        title: "Journal",
        icon: "notebook",
        color: "#160C21"
      },
      { key: "moments", title: "Moments", icon: "clock", color: "#160C21" },
      {
        key: "gold",
        title: "Smile File",
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
    ]
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    journalEntries: JournalEntriesRoute,
    moments: MomentsRoute,
    gold: GoldRoute,
    badges: BadgesRoute,
    profile: ProfileRoute
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}

export default Home;
