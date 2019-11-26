import { Image, View, StyleSheet, AsyncStorage, TextInput } from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import uuid from "uuid";

class NewJournalEntry extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    image: "../assets/journal.png",
    entry: null,
    title: null
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      //this.setState({ image: result.uri });
    }
  };

  storeData = async () => {
    if (this.state.entry !== null) {
      try {
        console.log("trying to save new journal entry to local storage");

        const entryId = uuid.v4();

        const journalEntry = {
          title: this.state.title,
          body: this.state.entry,
          image: this.state.image,
          date: new Date()
        };

        await AsyncStorage.setItem(entryId, JSON.stringify(journalEntry))
          .then(() => {
            console.log(`new journal entry ${entryId} saved to storage`);
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack(null);
          })
          .catch(e => {
            console.log(e);
          });
      } catch (e) {
        console.log(e.message);
      }
    } else {
      alert("please enter a reflection");
    }
  };

  render() {
    let { image } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.banner}>
          <TouchableOpacity onPress={this.pickImage}>
            {image && (
              <Image
                source={require("../assets/journal.png")}
                style={styles.image}
              />
            )}
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
            onPress={() => {
              this.props.navigation.state.params.onGoBack();
              this.props.navigation.goBack(null);
            }}
          />

          <Button
            buttonStyle={styles.saveButton}
            title={"Save"}
            onPress={this.storeData}
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
    backgroundColor: "#a5a5a5",
    flex: 4,
    justifyContent: "center"
  },
  image: {
    alignSelf: "center",
    width: 150,
    height: 150
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
