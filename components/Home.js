import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import JournalEntries from "./JournalEntries";

const JournalEntriesRoute = () => <JournalEntries />;

const MomentsRoute = () => <Text>Moments</Text>;

const GoldRoute = () => <Text>Gold</Text>;

const BadgesRoute = () => <Text>Badges</Text>;

class Home extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: "journalEntries", title: "Journal", icon: "notebook" },
      { key: "moments", title: "Moments", icon: "clock" },
      { key: "gold", title: "Gold", icon: "treasure-chest" },
      { key: "badges", title: "Badges", icon: "trophy-award" }
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
        style={{ backgroundColor: "#44CADD" }}
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}

export default Home;

// import React from "react";
// import { View, StyleSheet, Image } from "react-native";
// import NavigationService from "./NavigationService";
// import BottomNavigation, {
//   IconTab,
//   Badge
// } from "react-native-material-bottom-navigation";
// import { MaterialCommunityIcons } from "@expo/vector-icons/";

// class Home extends React.Component {
//   state = {
//     activeTab: "JournalEntries"
//   };

//   tabs = [
//     {
//       key: "JournalEntries",
//       label: "Journal",
//       barColor: "#44CADD",
//       pressColor: "rgba(255, 255, 255, 0.16)",
//       icon: "notebook"
//     },
//     {
//       key: "Moments",
//       label: "Moments",
//       barColor: "#44CADD",
//       pressColor: "rgba(255, 255, 255, 0.16)",
//       icon: "clock"
//     },
//     {
//       key: "PotOfGold",
//       label: "Gold",
//       barColor: "#44CADD",
//       pressColor: "rgba(255, 255, 255, 0.16)",
//       icon: "treasure-chest"
//     },
//     {
//       key: "Badges",
//       label: "Badges",
//       barColor: "#44CADD",
//       pressColor: "rgba(255, 255, 255, 0.16)",
//       icon: "trophy-award"
//     }
//   ];

//   state = {
//     activeTab: this.tabs[0].key
//   };

//   renderIcon = icon => ({ isActive }) => (
//     <MaterialCommunityIcons size={24} color="white" name={icon} />
//   );

//   renderTab = ({ tab, isActive }) => (
//     <IconTab
//       isActive={isActive}
//       key={tab.key}
//       label={tab.label}
//       renderIcon={this.renderIcon(tab.icon)}
//     />
//   );

//   showScreen(tab) {
//     NavigationService.navigate(tab);
//   }

//   render() {
//     return (
//       <View style={{ flex: 1, backgroundColor: "white" }}>
//         <View style={{ flex: 1 }}>{this.showScreen(this.state.activeTab)}</View>
//         <BottomNavigation
//           tabs={this.tabs}
//           activeTab={this.state.activeTab}
//           onTabPress={newTab => {
//             this.setState({ activeTab: newTab.key });
//           }}
//           renderTab={this.renderTab}
//           useLayoutAnimation
//         />
//       </View>
//     );
//   }
// }

// export default Home;
