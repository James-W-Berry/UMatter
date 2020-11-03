import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  Button,
  View,
  TouchableHighlight,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import NavigationService from "./NavigationService";

function logout() {
  firebase.auth().signOut();
}

export default function Profile() {
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [lastSignInTime, setLastSignInTime] = useState();
  const [creationDate, setCreationDate] = useState();

  useEffect(() => {
    if (firebase.auth().currentUser?.uid) {
      const db = firebase.firestore();
      let lastSignInTime = formatDate(
        new Date(firebase.auth().currentUser.metadata.lastSignInTime)
      );
      const creationDate = formatDate(
        new Date(firebase.auth().currentUser.metadata.creationTime)
      );

      setLastSignInTime(lastSignInTime);
      setCreationDate(creationDate);

      var userId = firebase.auth().currentUser.uid;
      var userDocRef = db.collection("users").doc(userId);

      userDocRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setUserData(doc.data());

            Object.keys(doc.data().groups).map(function (key) {
              db.collection("groups")
                .doc(key)
                .get()
                .then(function (doc) {
                  if (doc.exists) {
                    let groupData = {
                      [key]: {
                        numberOfMembers: Object.keys(doc.data().members).length,
                        name: doc.data().name,
                      },
                    };
                    setGroupData(groupData);
                  }
                });
            });
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  }, []);

  function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return `${monthNames[monthIndex]} ${day}, ${year}`;
  }

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
      }}
    >
      <View style={styles.statusBar} />
      {firebase.auth().currentUser?.uid ? (
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={80}
            color="#509C96"
          />
          <Text
            style={{
              fontSize: 24,
              fontFamily: "montserrat-regular",
            }}
          >
            {userData?.username}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "montserrat-regular",
            }}
          >
            {firebase.auth().currentUser.email}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "montserrat-regular",
              marginTop: "40%",
            }}
          >{`UMatter member since ${creationDate}`}</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "montserrat-regular",
              marginBottom: "10%",
            }}
          >{`Last signed in on ${lastSignInTime}`}</Text>
          <Button title={"Sign Out"} color="#509C96" onPress={requestLogout} />
        </View>
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
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#2C239A",
    height: Constants.statusBarHeight,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "montserrat-medium",
    color: "#fff",
  },
});
