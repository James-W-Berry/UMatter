import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import NavigationService from "./NavigationService";
import firebase from "../firebase";
import Constants from "expo-constants";
import { IconButton, Card } from "react-native-paper";

function createEventCard(event) {
  if (event) {
    return (
      <View key={event.id} style={{ margin: 10 }}>
        <TouchableOpacity onPress={() => onSelect(event)}>
          <Card>
            <Card.Cover source={{ uri: event.image }} />

            <Card.Content style={{ marginBottom: 0 }}>
              <Text style={styles.title}>{event.title}</Text>
              <Text
                style={styles.caption}
                numberOfLines={1}
                style={{
                  marginBottom: 10,
                }}
              >
                {event.description}
              </Text>

              <Text style={styles.date} style={{ marginTop: 5 }}>
                {event.date}
              </Text>
              <Text style={styles.date}>{event.time}</Text>
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
                  size={20}
                  style={{ margin: 0, marginLeft: -5 }}
                />
                <Text style={styles.date}>{event.attendees.length}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}

function onSelect(event) {
  const key = event.id;
  NavigationService.navigate("Event", {
    key,
    event,
    onGoBack: () => {
      console.log("navigating to events page");
    },
  });
}

function useEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("events")
      .orderBy("timestamp", "desc")
      .get()
      .then((snapshot) => {
        const retrievedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(retrievedEvents);
      });

    return () => unsubscribe();
  }, []);
  return events;
}

export default function Events() {
  const events = useEvents();

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <View style={styles.statusBar} />
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "#EFEFEF",
        }}
      >
        {events ? (
          <FlatList
            data={events}
            renderItem={({ item }) => createEventCard(item)}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#509C96" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#2C239A",
    height: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#EFEFEF",
  },
  pageTitle: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    color: "#160C21",
    alignSelf: "center",
    fontFamily: "montserrat-medium",
  },
  button: {
    elevation: 10,
    position: "absolute",
    bottom: 0,
    width: "26%",
    height: "10%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "montserrat-medium",
  },
  caption: {
    fontSize: 8,
    fontFamily: "montserrat-regular",
  },
  date: {
    fontSize: 12,
    fontFamily: "montserrat-regular",
  },
  clearButton: {
    alignSelf: "center",
    width: "30%",
    backgroundColor: "#00A9A5",
  },
});
