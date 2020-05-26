import {
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { Component } from "react";
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
      isLoading: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerRight: state.params.isLoading ? (
        <View style={styles.headerRightContainer}>
          <View style={{ width: "100%", padding: 15, marginRight: 10 }}>
            <ActivityIndicator size="small" color="#509C96" />
          </View>
        </View>
      ) : (
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
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.updateEntry });
    this.props.navigation.setParams({ handleDelete: this.deleteEntry });
    this.props.navigation.setParams({ isLoading: this.state.isLoading });
  }

  updateEntry = async () => {
    this.props.navigation.setParams({ isLoading: true });

    let { key, title, body } = this.state;
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .doc(key);

    const options = { year: "numeric", month: "long", day: "numeric" };
    let now = new Date().toLocaleDateString("en-US", options);

    docRef
      .set(
        {
          title: title,
          body: body,
          modifyDate: now,
        },
        { merge: true }
      )
      .then(() => {
        console.log(`successfully updated journal entry ${docRef.id}`);
        this.props.navigation.setParams({ isLoading: false });
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack(null);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  deleteEntry = async () => {
    this.props.navigation.setParams({ isLoading: true });
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
        this.updateTotalJournalEntries(-1);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.props.navigation.setParams({ isLoading: false });
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack(null);
  };

  updateTotalJournalEntries = async (value) => {
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase.firestore().collection("users").doc(userId);

    docRef.set(
      {
        totalJournalEntries: firebase.firestore.FieldValue.increment(value),
      },
      { merge: true }
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", paddingBottom: "10%" }}
          behavior="height"
          enabled
        >
          <View style={styles.headingContainer}>
            <TextInput
              style={styles.headingInput}
              placeholder="Title"
              onChangeText={(text) => this.setState({ title: text })}
              value={this.state.title}
              numberOfLines={1}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <View style={styles.entryContainer}>
            <TextInput
              style={styles.entryInput}
              placeholder="Your entry"
              onChangeText={(text) => this.setState({ body: text })}
              value={this.state.body}
              multiline={true}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  banner: {
    flex: 4,
    justifyContent: "center",
    backgroundColor: "#d1d1d1",
  },
  pickImageText: {
    fontSize: 16,
    color: "rgba(0, 122, 255,1.0)",
    alignSelf: "center",
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  save: {
    color: "#509C96",
    fontSize: 18,
    padding: 15,
    marginRight: 10,
  },
  delete: {
    color: "#509C96",
    fontSize: 18,
    padding: 15,
    marginRight: 15,
  },
  headingContainer: {
    flex: 2,
    width: "100%",
    height: "100%",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f8",
  },
  headingInput: {
    flex: 1,
    fontSize: 24,
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontFamily: "montserrat-regular",
  },
  entryContainer: {
    backgroundColor: "#ededed",
    flex: 8,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    paddingTop: "10%",
    marginBottom: "20%",
  },
  entryInput: {
    flex: 1,
    fontSize: 20,
    width: "100%",
    height: "100%",
    textAlign: "left",
    textAlignVertical: "top",
    fontFamily: "montserrat-regular",
  },
});

export default JournalEntry;
