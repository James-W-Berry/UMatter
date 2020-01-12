import React, { Component } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";

export default class MomentWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.props.moment,
      title: this.props.moment.title,
      time: this.props.moment.time,
      id: this.props.id,
      isDateTimePickerVisible: false,
      showMomentEditor: false
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

  editMoment = () => {
    if (this.state.showMomentEditor) {
      this.storeData();
    }
    this.setState({
      showMomentEditor: !this.state.showMomentEditor
    });
  };

  storeData = async () => {
    if (this.state.time !== null) {
      console.log("trying to update moment entry to local storage: ");

      const updatedMoment = {
        title: this.state.title,
        time: this.state.time,
        id: this.state.id
      };

      console.log(updatedMoment);

      if (this.state.id !== undefined) {
        await AsyncStorage.setItem(this.state.id, JSON.stringify(updatedMoment))
          .then(() => {
            console.log(`updated moment ${this.state.id} saved to storage`);
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      alert("please enter a time for your reflection");
    }
  };

  render() {
    console.log(this.state.time);
    return (
      <View
        style={{
          justifyContent: "center",
          width: "100%"
        }}
      >
        <TouchableOpacity style={styles.momentWidget} onPress={this.editMoment}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 20 }}>{this.state.time}</Text>
            <Text style={{ fontSize: 16 }} placeholder="Your entry">
              {this.state.title}
            </Text>
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
              <Icon name="delete" type="material-community" color="#bbb" />
            </TouchableOpacity>
          </View>

          <View style={styles.expandMomentButton}>
            <TouchableOpacity title="Edit" onPress={this.editMoment}>
              {this.state.showMomentEditor && (
                <Icon
                  name="chevron-up"
                  type="material-community"
                  color="#bbb"
                />
              )}
              {!this.state.showMomentEditor && (
                <Icon
                  name="chevron-down"
                  type="material-community"
                  color="#bbb"
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {this.state.showMomentEditor && (
          <View style={styles.editMomentWidget}>
            <TouchableOpacity
              onPress={this.showDateTimePicker}
              title="Show datetime picker"
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
        )}
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
  newMomentTitle: {
    flex: 1,
    margin: 8
  },
  momentWidget: {
    flexDirection: "row",
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#efefef",
    padding: 15,
    marginTop: 5,
    borderRadius: 10
  },
  editMomentWidget: {
    flexDirection: "column",
    width: "75%",
    alignSelf: "center",
    backgroundColor: "#efefef",
    padding: 15
  },
  deleteMomentButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: 15,
    alignSelf: "center",
    width: "10%"
  },
  expandMomentButton: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "20%",
    alignSelf: "center",
    width: "10%"
  }
});
