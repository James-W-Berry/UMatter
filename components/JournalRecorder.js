import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import React, { Component } from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import NavigationService from "./NavigationService";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class JournalRecorder extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      if (status !== "granted") {
        alert("Sorry, we need audio recording permissions to make this work!");
      }
    }
  };

  startRecording = async () => {
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      console.log("now recording");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.recorder}>
          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => this.startRecording()}
          >
            <MaterialCommunityIcons name="record" size={200} color="#921111" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C239A"
  },
  recorder: {
    flex: 1,
    backgroundColor: "#191919"
  },
  recordButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default JournalRecorder;
