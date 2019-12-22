import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  TextInput
} from "react-native";
import React, { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import uuid from "uuid";

class NewJournalEntry extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: (
        <Text style={styles.save} onPress={() => state.params.handleSave()}>
          Save
        </Text>
      )
    };
  };

  state = {
    image: null,
    entry: null,
    title: null
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.props.navigation.setParams({ handleSave: this.storeData });
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
      this.setState({ image: result.uri });
    }
  };

  storeData = async () => {
    if (this.state.entry !== null) {
      try {
        console.log("trying to save new journal entry to local storage");

        var options = { year: "numeric", month: "long", day: "numeric" };
        date = new Date().toLocaleDateString("en-US", options);

        const entryId = `journal_${date}_${uuid.v4()}`;

        const journalEntry = {
          title: this.state.title,
          body: this.state.entry,
          image: this.state.image,
          date: date
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

    if (image == null) {
      return (
        <View style={styles.container}>
          <View style={styles.banner}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={this.pickImage}
            >
              <Text style={styles.pickImageText}> Pick an image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headingContainer}>
            <TextInput
              style={styles.headingInput}
              placeholder="Title"
              onChangeText={text => this.setState({ title: text })}
              value={this.state.title}
              numberOfLines={1}
            />
          </View>

          <View style={styles.entryContainer}>
            <TextInput
              style={styles.entryInput}
              placeholder="Your entry"
              onChangeText={text => this.setState({ entry: text })}
              value={this.state.entry}
              multiline={true}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.banner}>
            {image && (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={this.pickImage}
              >
                <Image source={{ uri: image }} style={styles.image} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.headingContainer}>
            <TextInput
              style={styles.headingInput}
              placeholder="Title"
              onChangeText={text => this.setState({ title: text })}
              value={this.state.title}
              numberOfLines={1}
            />
          </View>

          <View style={styles.entryContainer}>
            <TextInput
              style={styles.entryInput}
              placeholder="Your entry"
              onChangeText={text => this.setState({ entry: text })}
              value={this.state.entry}
              multiline={true}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  banner: {
    backgroundColor: "#d1d1d1",
    flex: 4,
    justifyContent: "center"
  },
  pickImageText: {
    fontSize: 16,
    color: "rgba(0, 122, 255,1.0)",
    alignSelf: "center"
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  save: {
    color: "rgba(0, 122, 255,1.0)",
    fontSize: 18,
    marginRight: 8,
    backgroundColor: "rgba(0, 0, 0, 0.0)"
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: "#fff4"
  },
  headingContainer: {
    backgroundColor: "#f7f7f8",
    flex: 1,
    fontSize: 30
  },
  headingInput: {
    flex: 1,
    fontSize: 24,
    margin: 8
  },
  entryContainer: {
    backgroundColor: "#ededed",
    flex: 8,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1
  },
  entryInput: {
    flex: 1,
    fontSize: 16,
    margin: 8
  }
});

export default NewJournalEntry;
