import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationService from "./NavigationService";
import firebase from "../firebase";
import { useSafeArea } from "react-native-safe-area-context";
import Constants from "expo-constants";
import ActionButton from "react-native-action-button";

function createJournalEntry(entry) {
  if (entry) {
    return (
      <View key={entry.id}>
        <TouchableOpacity onPress={() => onSelect(entry)}>
          <Card>
            <Text style={styles.title}>{entry.title}</Text>
            <Text
              style={styles.caption}
              numberOfLines={1}
              style={{
                marginBottom: 10,
              }}
            >
              {entry.body}
            </Text>
            <Text style={styles.date}>{entry.creationDate}</Text>
          </Card>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}

function onSelect(entry) {
  const key = entry.id;
  NavigationService.navigate("JournalEntry", {
    key,
    entry,
    onGoBack: () => {
      console.log("went back to journal entries");
    },
  });
}

function useJournalEntries(userId) {
  const [entries, setEntries] = useState(null);

  if (userId) {
    useEffect(() => {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("journalEntries")
        .orderBy("creationTimestamp", "desc")
        .onSnapshot((snapshot) => {
          const retrievedEntries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEntries(retrievedEntries);
        });

      return () => unsubscribe();
    }, []);
  }

  return entries;
}

function JournalEntries() {
  const userId = firebase.auth().currentUser?.uid;
  const [isLoading, setIsLoading] = useState(false);
  const journalEntries = useJournalEntries(userId);
  const insets = useSafeArea();

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "#EFEFEF",
        }}
      >
        <Text style={styles.pageTitle}>Journal</Text>

        {userId ? (
          journalEntries ? (
            <View style={[styles.container]}>
              <FlatList
                data={journalEntries}
                renderItem={({ item }) => createJournalEntry(item)}
                keyExtractor={(item) => item.id.toString()}
              />

              <ActionButton
                buttonColor="#509C96"
                onPress={() =>
                  NavigationService.navigate("NewJournalEntry", {
                    onGoBack: () => {
                      console.log("back to JournalEntries");
                    },
                  })
                }
              />
            </View>
          ) : (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#509C96" />
            </View>
          )
        ) : (
          <View style={styles.centeredView}>
            <TouchableHighlight
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#509C96",
                padding: 15,
                borderRadius: 5,
              }}
              onPress={() => {
                NavigationService.navigate("SignInPage");
              }}
            >
              <Text style={styles.title}>Sign In</Text>
            </TouchableHighlight>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});

export default JournalEntries;
