import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button } from "react-native-elements";

export default class Moments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={{
            [this.state.selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange"
            }
          }}
        />
        <Text style={styles.text}>Your Moments</Text>

        <View style={styles.moment}>
          <Button style={styles.startButton} title="Start"></Button>
        </View>
      </SafeAreaView>
    );
  }

  onDayPress(day) {
    this.setState({
      selected: day.dateString
    });
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 350
  },
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10,
    backgroundColor: "#eee"
  },
  container: {
    flex: 1
  },
  moment: {
    flex: 1,
    justifyContent: "center"
  },
  startButton: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#00A9A5"
  }
});
