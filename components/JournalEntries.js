import React, { useState, useEffect } from "react";
import {
  AsyncStorage,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Card } from "react-native-elements";
import _ from "lodash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavigationService from "./NavigationService";
import firebase from "../firebase";
import { StatusBar } from "react-native";

function createJournalEntry(entry) {
  if (entry) {
    return (
      <View key={entry.id}>
        <TouchableOpacity onPress={() => onSelect(entry)}>
          {entry.image ? (
            <Card image={{ uri: entry.image }}>
              <Text style={styles.title}>{entry.title}</Text>
              <Text
                style={styles.caption}
                numberOfLines={1}
                style={{
                  marginBottom: 10
                }}
              >
                {entry.body}
              </Text>
              <Text style={styles.date}>{entry.creationDate}</Text>
            </Card>
          ) : (
            <Card>
              <Text style={styles.title}>{entry.title}</Text>
              <Text
                style={styles.caption}
                numberOfLines={1}
                style={{
                  marginBottom: 10
                }}
              >
                {entry.body}
              </Text>
              <Text style={styles.date}>{entry.creationDate}</Text>
            </Card>
          )}
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
    }
  });
}

function useJournalEntries() {
  const [entries, setEntries] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("journalEntries")
      .orderBy("creationTimestamp", "desc")
      .onSnapshot(snapshot => {
        const retrievedEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEntries(retrievedEntries);
        return () => unsubscribe();
      });
  }, []);
  return entries;
}

function JournalEntries() {
  const [isLoading, setIsLoading] = useState(false);
  const journalEntries = useJournalEntries();
  const [debugMode, setDebugMode] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} translucent={true} />
      <Text style={styles.pageTitle}>Journal</Text>

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          alignSelf: "flex-end",
          flexGrow: 1
        }}
      >
        {journalEntries ? (
          <FlatList
            data={journalEntries}
            renderItem={({ item }) => createJournalEntry(item)}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#509C96" />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          NavigationService.navigate("NewJournalEntry", {
            onGoBack: () => {
              console.log("went back to journal entries");
            }
          })
        }
      >
        <MaterialCommunityIcons name="plus-circle" size={50} color="#509C96" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF"
  },
  pageTitle: {
    fontSize: 24,
    color: "#191919",
    alignSelf: "center",
    fontFamily: "montserrat-regular"
  },
  button: {
    elevation: 10,
    position: "absolute",
    bottom: 0,
    width: "26%",
    height: "10%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontFamily: "montserrat-medium"
  },
  caption: {
    fontSize: 8,
    fontFamily: "montserrat-regular"
  },
  date: {
    fontSize: 12,
    fontFamily: "montserrat-regular"
  },
  clearButton: {
    alignSelf: "center",
    width: "30%",
    backgroundColor: "#00A9A5"
  }
});

export default JournalEntries;
