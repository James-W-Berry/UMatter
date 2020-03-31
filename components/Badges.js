import React, { useState, useEffect } from "react";
import { Text, StyleSheet, StatusBar, View } from "react-native";
import firebase from "../firebase";

function useUser() {
  const [user, setUser] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(doc => {
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
      <Text style={styles.pageTitle}>Achievements</Text>
      <Text
        style={styles.text}
      >{`Total Entries: ${user.totalJournalEntries}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#2C239A"
  },
  pageTitle: {
    fontSize: 24,
    color: "#EFEFEF",
    alignSelf: "center",
    fontFamily: "montserrat-regular"
  },
  text: {
    color: "#EDEDED",
    fontSize: 16,
    fontFamily: "montserrat-regular",
    marginTop: "10%"
  }
});
