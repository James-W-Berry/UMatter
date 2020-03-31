import {
  Image,
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import React, { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";
import firebase from "../firebase";

class JournalEntry extends Component {
  constructor(props) {
    super(props);

    let entry = props.navigation.state.params.entry;

    this.state = {
      key: entry.id,
      title: entry.title,
      body: entry.body,
      date: entry.creationDate,
      image: entry.image,
      isLoading: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: (
        <View style={styles.headerRightContainer}>
          <Text
            style={styles.delete}
            onPress={() => state.params.handleDelete()}
          >
            Delete
          </Text>

          <Text style={styles.save} onPress={() => state.params.handleSave()}>
            Save
          </Text>
        </View>
      )
    };
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.props.navigation.setParams({ handleSave: this.updateEntry });
    this.props.navigation.setParams({ handleDelete: this.deleteEntry });
  }

  deleteEntry = async () => {
    let id = this.state.key;
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc(this.state.key);

    docRef
      .delete()
      .then(() => {
        console.log(`successfully deleted journal entry ${docRef.id}`);
        _this.updateTotalJournalEntries(-1);
      })
      .catch(function(error) {
        console.log(error);
      });

    if (this.state.image) {
      const storageRef = firebase
        .storage()
        .ref()
        .child(`journalPictures/${userId}/${id}`);

      return storageRef
        .delete()
        .then(() => {
          console.log("successfully deleted journal entry image");
          _this.props.navigation.state.params.onGoBack();
          _this.props.navigation.goBack(null);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      _this.props.navigation.state.params.onGoBack();
      _this.props.navigation.goBack(null);
    }
  };

  updateTotalJournalEntries = async value => {
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    docRef.set(
      {
        totalJournalEntries: firebase.firestore.FieldValue.increment(value)
      },
      { merge: true }
    );
  };

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
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
      this.setState({ newImage: result.uri, image: result.uri });
    }
  };

  updateEntry = async () => {
    let { key, title, body, image, newImage } = this.state;
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc(key);

    const options = { year: "numeric", month: "long", day: "numeric" };
    let now = new Date().toLocaleDateString("en-US", options);

    return docRef
      .set(
        {
          title: title,
          body: body,
          modifyDate: now
        },
        { merge: true }
      )
      .then(() => {
        console.log(`successfully created journal entry ${docRef.id}`);
        if (newImage) {
          _this.uploadJournalEntryPicture(newImage, docRef.id);
        } else {
          _this.props.navigation.state.params.onGoBack();
          _this.props.navigation.goBack(null);
        }
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

  saveNewJournalEntry = async () => {
    let { title, body, image, key } = this.state;
    let _this = this;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc(key);

    const options = { year: "numeric", month: "long", day: "numeric" };
    let now = new Date().toLocaleDateString("en-US", options);

    return docRef
      .set(
        {
          title: title,
          body: body,
          modifyDate: now
        },
        { merge: true }
      )
      .then(() => {
        console.log(docRef.id);
        console.log(`successfully updated journal entry ${docRef.id}`);
        _this.uploadJournalEntryPicture(image, docRef.id);
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    let { image } = this.state;

    if (image == null) {
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled
          >
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
                onChangeText={text => this.setState({ body: text })}
                value={this.state.body}
                multiline={true}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled
          >
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
                onChangeText={text => this.setState({ body: text })}
                value={this.state.body}
                multiline={true}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
    flex: 4,
    justifyContent: "center",
    backgroundColor: "#d1d1d1"
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
  delete: {
    color: "red",
    fontSize: 18,
    padding: 15,
    marginRight: 15
  },
  headingContainer: {
    backgroundColor: "#f7f7f8",
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 30
  },
  headingInput: {
    flex: 1,
    fontSize: 24
  },
  entryContainer: {
    backgroundColor: "#ededed",
    flex: 8,
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8
  },
  entryInput: {
    flex: 1,
    fontSize: 16
  }
});

export default JournalEntry;
