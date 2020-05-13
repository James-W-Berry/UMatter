import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, Alert, Button, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";
import "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import _ from "lodash";

function logout() {
  firebase.auth().signOut();
}

export default function Profile() {
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [lastSignInTime, setLastSignInTime] = useState();
  const [creationDate, setCreationDate] = useState();

  useEffect(() => {
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
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} translucent={true} />

      <MaterialCommunityIcons name="account-circle" size={80} color="#509C96" />
      <Text
        style={{
          color: "#EDEDED",
          fontSize: 24,
          fontFamily: "montserrat-regular",
        }}
      >
        {userData?.username}
      </Text>
      <Text
        style={{
          color: "#EDEDED",
          fontSize: 16,
          fontFamily: "montserrat-regular",
        }}
      >
        {firebase.auth().currentUser.email}
      </Text>
      {/* <Text
        style={{
          color: "#EDEDED",
          fontSize: 16,
          fontFamily: "montserrat-regular",
          marginTop: "10%"
        }}
      >
        Your Groups:
      </Text>
      {userData.groups && groupData
        ? Object.keys(userData.groups).map(function(key) {
            return (
              <View
                key={`${key}View`}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Text
                  style={{
                    color: "#EDEDED",
                    fontSize: 16,
                    fontFamily: "montserrat-regular"
                  }}
                  key={key}
                >
                  {`${groupData[key].name} - `}
                </Text>

                <Text
                  style={{
                    color: "#EDEDED",
                    fontSize: 16,
                    fontFamily: "montserrat-regular"
                  }}
                  key={`${key}UsersNumber`}
                >
                  {`${groupData[key].numberOfMembers} Member(s)`}
                </Text>
              </View>
            );
          })
        : null} */}

      <Text
        style={{
          color: "#EDEDED",
          fontSize: 16,
          fontFamily: "montserrat-regular",
          marginTop: "40%",
        }}
      >{`UMatter member since ${creationDate}`}</Text>
      <Text
        style={{
          color: "#EDEDED",
          fontSize: 16,
          fontFamily: "montserrat-regular",
          marginBottom: "10%",
        }}
      >{`Last signed in on ${lastSignInTime}`}</Text>

      <Button title={"Sign Out"} color="#509C96" onPress={requestLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C239A",
  },
});
