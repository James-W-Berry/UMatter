import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Modal,
  Alert,
  TouchableHighlight,
} from "react-native";
import { IconButton, Divider, ActivityIndicator } from "react-native-paper";
import NavigationService from "./NavigationService";
import firebase from "../firebase";

export default function Event(props) {
  let event = props.navigation.state.params.event;
  const userId = firebase.auth().currentUser?.uid;
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showAttendees, setShowAttendees] = useState(false);
  function addToAttendees(userId, eventId) {
    setIsLoading(true);
    const docRef = firebase.firestore().collection("events").doc(eventId);

    docRef
      .set(
        { attendees: firebase.firestore.FieldValue.arrayUnion(userId) },
        { merge: true }
      )
      .then(() => {
        setIsLoading(false);
        setUpdate(true);
        setUpdateMessage("You're attending, see you there!");
        props.navigation.state.params.onGoBack();
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
        Alert.alert(
          "Error",
          "Please try again later",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      });
  }

  function removeFromAttendees(userId, eventId) {
    setIsLoading(true);
    const docRef = firebase.firestore().collection("events").doc(eventId);

    docRef
      .set(
        { attendees: firebase.firestore.FieldValue.arrayRemove(userId) },
        { merge: true }
      )
      .then(() => {
        setIsLoading(false);
        setUpdate(true);
        setUpdateMessage("You're no longer attending :(");
        props.navigation.state.params.onGoBack();
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error);
        Alert.alert(
          "Error",
          "Please try again later",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 250 }}
      >
        <View>
          {setShowAttendees && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showAttendees}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {event.attendees.map((attendee) => {
                    return (
                      <Text key={attendee} style={styles.modalText}>
                        {attendee}
                      </Text>
                    );
                  })}

                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#509C96" }}
                    onPress={() => {
                      setShowAttendees(!showAttendees);
                    }}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          )}
          <View
            style={{
              display: "flex",
              alignItems: "center",
              margin: 10,
            }}
          >
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.caption}>{event.description}</Text>
          </View>

          <View
            style={{
              display: "flex",
              width: "100%",
              height: "25%",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: event.image,
              }}
            />
          </View>
          <Divider style={{ width: "100%" }} />

          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              margin: 20,
            }}
          >
            <Text style={styles.caption}>{event.date}</Text>
            <Text style={styles.caption}>{event.time}</Text>
          </View>

          <Divider style={{ width: "100%" }} />

          <View
            style={{
              display: "flex",
              margin: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <IconButton
                icon="map-marker"
                color={"#00A9A5"}
                size={40}
                style={{ margin: 0 }}
              />
              <Text style={styles.date}>
                {`Friendship Circle\n6892 W Maple Rd\nWest Bloomfield Township\nMI 48322`}
              </Text>
            </View>
          </View>
          <Divider style={{ width: "100%" }} />

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <Text style={[styles.caption, { margin: 10 }]}>
              {`Event agenda\n-agenda item 1\n-agenda item 2\n-agenda item 3`}
            </Text>
            <Text style={[styles.caption, { margin: 10 }]}>
              {`any supporting materials\n-link to relevant resources page`}
            </Text>
          </View>

          <Divider style={{ width: "100%" }} />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <Text style={styles.caption}>Event organizer:</Text>
            <Text style={styles.caption}>{event.organizer}</Text>
          </View>
        </View>
        <Divider style={{ width: "100%" }} />

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowAttendees(true)}
            style={{ padding: 20 }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconButton
                icon="account-group"
                color={"#00A9A5"}
                size={40}
                style={{ margin: 0, marginLeft: -5 }}
              />
              <Text style={styles.date}>{event.attendees.length}</Text>
            </View>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator size="large" color="#509C96" />
          ) : update ? (
            <Text style={styles.caption}>{updateMessage}</Text>
          ) : (
            <TouchableOpacity
              style={{
                marginRight: 40,
                marginLeft: 40,
                marginTop: 10,
                padding: 10,
                backgroundColor: "#509C96",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              onPress={() => {
                userId
                  ? event.attendees.includes(userId)
                    ? removeFromAttendees(userId, event.id)
                    : addToAttendees(userId, event.id)
                  : NavigationService.navigate("SignInPage");
              }}
              underlayColor="#fff"
            >
              <Text style={styles.buttonText}>
                {event.attendees.includes(userId)
                  ? `You're going. Need to cancel?`
                  : `Sign up for ${event.title}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "montserrat-medium",
  },
  caption: {
    fontSize: 16,
    fontFamily: "montserrat-regular",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "montserrat-regular",
    textAlign: "center",
    color: "#fff",
  },
  date: {
    fontSize: 16,
    fontFamily: "montserrat-regular",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
