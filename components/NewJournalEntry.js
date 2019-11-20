import { Image, View, StyleSheet, Text, TextInput } from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class NewJournalEntry extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    headerTitle: "New Journal Entry"
  };

  state = {
    image: "../assets/icon.png",
    entry: "",
    title: ""
  };

  componentDidMount() {
    this.getPermissionAsync();
    console.log("hi");
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    let { image } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.banner}>
          <TouchableOpacity onPress={this._pickImage}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </TouchableOpacity>
        </View>

        <View style={styles.heading}>
          <TextInput
            autoFocus={true}
            placeholder="Journal Entry Title"
            onChangeText={text => this.setState({ title: text })}
            value={this.state.title}
            numberOfLines={1}
          />
        </View>

        <View style={styles.entry}>
          <TextInput
            placeholder="Your entry..."
            onChangeText={text => this.setState({ entry: text })}
            value={this.state.entry}
            multiline={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.cancelButton}
            title={"Cancel"}
            onPress={() => console.log("cancelled entry")}
          />

          <Button
            buttonStyle={styles.saveButton}
            title={"Save"}
            onPress={() => console.log("saved entry")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  banner: {
    flex: 4
  },
  image: {
    width: "100%",
    height: "100%"
  },
  buttonContainer: {
    backgroundColor: "#123543",
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  saveButton: {
    marginRight: 8,
    backgroundColor: "#44CADD"
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: "#fff4"
  },
  heading: {
    backgroundColor: "#f7f7f8",
    flex: 1,
    fontSize: 30
  },
  entry: {
    backgroundColor: "#ededed",
    flex: 8,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1
  }
});

export default NewJournalEntry;
