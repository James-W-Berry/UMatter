import React, { Component } from "react";
import { BottomNavigation } from "react-native-paper";
import JournalEntries from "./JournalEntries";
import Moments from "./Moments";
import SmileFile from "./SmileFile";
import Badges from "./Badges";

const JournalEntriesRoute = () => <JournalEntries />;

const MomentsRoute = () => <Moments />;

const GoldRoute = () => <SmileFile />;

const BadgesRoute = () => <Badges />;

class Home extends Component {
  state = {
    index: 0,
    routes: [
      {
        key: "journalEntries",
        title: "Journal",
        icon: "notebook",
        color: "#44CADD"
      },
      { key: "moments", title: "Moments", icon: "clock", color: "#44CADD" },
      {
        key: "gold",
        title: "Smile File",
        icon: "treasure-chest",
        color: "#44CADD"
      },
      { key: "badges", title: "Badges", icon: "trophy-award", color: "#44CADD" }
    ]
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    journalEntries: JournalEntriesRoute,
    moments: MomentsRoute,
    gold: GoldRoute,
    badges: BadgesRoute
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
