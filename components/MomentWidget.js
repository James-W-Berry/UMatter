import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";

export default class MomentWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.props.moment,
      title: this.props.moment.title,
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
      <View style={{ justifyContent: "center", flexGrow: 1, width: "100%" }}>
        <View style={styles.momentWidget}>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity
              onPress={this.showDateTimePicker}
              title="Show datetime picker!"
            >
              <Text style={{ fontSize: 20 }}>{this.state.time}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.entryInput}
              placeholder="Your entry"
              onChangeText={text => this.setState({ title: text })}
              value={this.state.title}
            />
          </View>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="time"
          />

          <View style={styles.deleteMomentButton}>
            <TouchableOpacity
              title="Delete"
              onPress={() => this.props.deleteMoment(this.state.moment.id)}
            >
              <Icon name="delete" type="material-community" color="#efefef" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10
  },
  newMoment: {
    backgroundColor: "#f7f7f8",
    flex: 1
  },
  newMomentTitle: {
    flex: 1,
    margin: 8
  },
  momentWidget: {
    flexDirection: "row",
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#bbb",
    padding: 15,
    marginBottom: 5,
    borderRadius: 10
  },
  deleteMomentButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: 15,
    alignSelf: "center",
    width: "10%"
  }
});
