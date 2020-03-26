import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import React, { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import uuid from "uuid";
import NavigationService from "./NavigationService";
import firebase from "../firebase";

class NewJournalEntry extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: (
        <View style={styles.headerRightContainer}>
          <Text style={styles.save} onPress={() => state.params.handleSave()}>
            Save
          </Text>
        </View>
      )
    };
  };

  state = {
    image: null,
    title: null,
    body: null
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.props.navigation.setParams({ handleSave: this.saveNewJournalEntry });
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

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  saveNewJournalEntry = async () => {
    let { title, body, image } = this.state;
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc();

    const options = { year: "numeric", month: "long", day: "numeric" };
    let now = new Date().toLocaleDateString("en-US", options);

    return docRef
      .set(
        {
          title: title,
          body: body,
          creationDate: now
        },
        { merge: true }
      )
      .then(() => {
        console.log(docRef.id);
        console.log(`successfully created journal entry ${docRef.id}`);
        _this.uploadJournalEntryPicture(image, docRef.id);
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  uploadJournalEntryPicture = async (picture, id) => {
    let _this = this;
    if (picture !== null) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", picture, true);
        xhr.send(null);
      });

      const userId = firebase.auth().currentUser.uid;
      var storageRef = firebase.storage().ref();
      var journalEntryPictureRef = storageRef.child(
        `journalPictures/${userId}/${id}`
      );
      let uploadJournalEntryPictureTask = journalEntryPictureRef.put(blob);

      uploadJournalEntryPictureTask.on(
        "state_changed",
        function(snapshot) {
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        function(error) {
          console.log(error);
          blob.close();
        },
        function() {
          blob.close();
          uploadJournalEntryPictureTask.snapshot.ref
            .getDownloadURL()
            .then(function(downloadURL) {
              console.log("File available at", downloadURL);
              _this.registerJournalEntryPictureUrl(downloadURL, id);
            });
        }
      );
    } else {
      _this.props.navigation.state.params.onGoBack();
      _this.props.navigation.goBack(null);
    }
  };

  registerJournalEntryPictureUrl = async (downloadUrl, id) => {
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc(id);

    return docRef
      .set(
        {
          image: downloadUrl
        },
        { merge: true }
      )
      .then(function() {
        console.log(
          "successfully updated journal entry with picture reference"
        );
        _this.props.navigation.state.params.onGoBack();
        _this.props.navigation.goBack(null);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    let { image } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={styles.container}>
            <View style={styles.banner}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={this.pickImage}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Text style={styles.pickImageText}> Pick an image</Text>
                )}
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
                onChangeText={text => this.setState({ body: text })}
                value={this.state.body}
                multiline={true}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
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
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  save: {
    color: "rgba(0, 122, 255,1.0)",
    fontSize: 18,
    padding: 15,
    marginRight: 10
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
    margin: 8,
    fontFamily: "montserrat-regular"
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
    margin: 8,
    fontFamily: "montserrat-regular"
  }
});

export default NewJournalEntry;
