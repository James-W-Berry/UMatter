import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import React, { Component } from "react";
import firebase from "../firebase";
import NavigationService from "./NavigationService";

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
      ),
    };
  };

  state = {
    image: null,
    title: null,
    body: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.saveNewJournalEntry });
  }

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
    let nowTimestamp = new Date().getTime();

    return docRef
      .set(
        {
          title: title,
          body: body,
          creationDate: now,
          creationTimestamp: nowTimestamp,
        },
        { merge: true }
      )
      .then(() => {
        console.log(`successfully created journal entry ${docRef.id}`);
        _this.updateTotalJournalEntries(1);
        _this.props.navigation.state.params.onGoBack();
        _this.props.navigation.goBack(null);
      })

      .catch(function (error) {
        console.log(error);
      });
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
          behavior="height"
          enabled
          style={{ flex: 1, flexDirection: "column", paddingBottom: "10%" }}
        >
          <View style={styles.headingContainer}>
            <TextInput
              style={styles.headingInput}
              placeholder="Entry title"
              autoFocus={true}
              onChangeText={(text) => this.setState({ title: text })}
              value={this.state.title}
              numberOfLines={1}
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
    backgroundColor: "#d1d1d1",
    flex: 4,
    justifyContent: "center",
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

export default NewJournalEntry;
