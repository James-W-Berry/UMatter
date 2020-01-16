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

class JournalEntry extends Component {
  constructor(props) {
    super(props);

    let { params } = props.navigation.state;

    this.state = {
      key: params.key,
      title: params.data.title,
      body: params.data.body,
      date: params.data.date,
      image: params.data.image,
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
    this.props.navigation.setParams({ handleSave: this.storeData });
    this.props.navigation.setParams({ handleDelete: this.deleteEntry });
  }

  deleteEntry = async () => {
    try {
      console.log(`deleting entry ${this.state.key}`);
      AsyncStorage.removeItem(this.state.key).then(response => {
        console.log(response);
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack(null);
      });
    } catch (e) {
      console.log(e.message);
    }
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
      this.setState({ image: result.uri });
    }
  };

  storeData = async () => {
    if (this.state.body !== null) {
      console.log("trying to save new journal entry to local storage");

      const journalEntry = {
        title: this.state.title,
        body: this.state.body,
        image: this.state.image,
        date: this.state.date
      };
      await AsyncStorage.setItem(this.state.key, JSON.stringify(journalEntry))
        .then(() => {
          console.log(
            `updated journal entry ${this.state.key} saved to storage`
          );
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack(null);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      alert("please enter a reflection");
    }
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
    flex: 1,
    flexDirection: "row",
    padding: 8
  },
  save: {
    color: "rgba(0, 122, 255,1.0)",
    fontSize: 18,
    marginRight: 8,
    backgroundColor: "rgba(0, 0, 0, 0.0)"
  },
  delete: {
    color: "red",
    fontSize: 18,
    marginRight: 20,
    backgroundColor: "rgba(0, 0, 0, 0.0)"
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
