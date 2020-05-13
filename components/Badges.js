import React, { useState, useEffect } from "react";
import { Text, StyleSheet, StatusBar, View } from "react-native";
import firebase from "../firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function useUser() {
  const [user, setUser] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
        const user = doc.data();
        setUser(user);
      });
    return () => unsubscribe();
  }, []);
  return user;
}

export default function Badges() {
  const user = useUser();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} translucent={true} />
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Achievements</Text>
        <MaterialCommunityIcons name="medal" size={60} color="white" />
      </View>

      <View style={styles.achievementContainer}>
        <View style={styles.achievement}>
          <MaterialCommunityIcons name="notebook" size={32} color="white" />
          <Text
            style={styles.text}
          >{`Entries Recorded: ${user.totalJournalEntries}`}</Text>
        </View>

        <View style={styles.achievement}>
          <MaterialCommunityIcons name="history" size={32} color="white" />
          <Text
            style={styles.text}
          >{`Moments Completed: ${user.totalMoments}`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#2C239A",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  achievement: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "montserrat-regular",
    color: "#EFEFEF",
  },
  text: {
    color: "#EDEDED",
    fontSize: 24,
    fontFamily: "montserrat-regular",
    textAlign: "left",
    padding: 10,
  },
});
