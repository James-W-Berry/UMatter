import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class MomentWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.props.moment,
      isDateTimePickerVisible: false,
      time: "7am"
    };
  }

  showDateTimePicker = () => {
    console.log(this.state.isDateTimePickerVisible);
    this.setState({ isDateTimePickerVisible: true });
    console.log(this.state.isDateTimePickerVisible);
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    let time = date.toString();
    this.setState({ time: time.split(" ")[4] });
    this.hideDateTimePicker();
  };
  render() {
    return (
      <View style={styles.momentWidget}>
        <Text>{this.state.moment.title} @ </Text>
        <TouchableOpacity
          onPress={this.showDateTimePicker}
          title="Show datetime picker!"
        >
          <Text>{this.state.time}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteMomentButton}
          title="Delete"
          onPress={() => this.props.deleteMoment(this.state.moment.id)}
        >
          <Text>Delete</Text>
        </TouchableOpacity>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="time"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee"
    //height: 350
  },
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10
  },
  container: {
    flex: 1
  },
  momentSummary: {
    flex: 3,
    justifyContent: "center",
    backgroundColor: "#bbb"
  },
  momentScheduler: {
    flex: 1,
    justifyContent: "center"
  },
  newMoment: {
    backgroundColor: "#f7f7f8",
    flex: 1
  },
  newMomentTitle: {
    flex: 1,
    margin: 8
  },
  startButton: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#00A9A5"
  },
  saveButton: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 0,
    width: "30%",
    backgroundColor: "#00A9A5"
  },
  cancelButton: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 0,
    top: 15,
    width: "30%",
    backgroundColor: "#00A9A5"
  },
  momentWidget: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#bbb"
  },
  deleteMomentButton: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 0,
    width: "30%",
    backgroundColor: "#afaf"
  },
  unscheduledMoment: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#bbb"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
