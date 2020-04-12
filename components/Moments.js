import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import NavigationService from "./NavigationService";
import firebase from "../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeArea } from "react-native-safe-area-context";
import Constants from "expo-constants";

function useMoments() {
  const [moments, setMoments] = useState({});
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .onSnapshot((snapshot) => {
        const retrievedMoments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let formattedMoments = {};

        retrievedMoments.forEach((moment) => {
          const time = new Date(moment.timestamp);
          const strTime = time.toISOString().split("T")[0];

          if (!formattedMoments[strTime]) {
            formattedMoments[strTime] = [];
          }
          formattedMoments[strTime].push({
            ...moment,
          });
        });

        setMoments(formattedMoments);
      });

    return () => unsubscribe();
  }, []);

  return moments;
}

export default function Moments() {
  const moments = useMoments();
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [showActionButton, setShowActionButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [items, setItems] = useState({});
  const insets = useSafeArea();

  useEffect(() => {
    getPermissionAsync();
    listenForNotifications();
  });

  useEffect(() => {
    let today = new Date().getDate();
    setSelectedDay(today);
  }, []);

  async function getPermissionAsync() {
    let { status } = await Permissions.askAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    if (status !== "granted") {
      alert("Sorry, we need notification permissions to make this work!");
    }
  }

  async function listenForNotifications() {
    Notifications.addListener(handleNotification);
  }

  function handleNotification(origin, data, remote) {
    console.log(data);
    message = data.message;
    let info = `Start your moment!`;
    Alert.alert(
      `UMatter - ${message}`,
      info,
      [
        {
          text: "Begin",
          onPress: () => {
            console.log("starting moment");
            NavigationService.navigate("MomentVisualization");
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }

  function onEditMoment(moment) {
    console.log(moment);
    NavigationService.navigate("EditMoment", {
      moment,
      onGoBack: () => {
        console.log("went back to moments");
      },
    });
  }

  onDeleteMoment = async (moment) => {
    setIsLoading(true);
    let _this = this;
    const userId = firebase.auth().currentUser.uid;

    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .doc(moment.id);

    return docRef
      .delete()
      .then(() => {
        console.log(`successfully deleted moment ${docRef.id}`);
        _this.updateTotalMoments(-1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  updateTotalMoments = async (value) => {
    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase.firestore().collection("users").doc(userId);

    docRef
      .set(
        {
          totalMoments: firebase.firestore.FieldValue.increment(value),
        },
        { merge: true }
      )
      .then(() => {
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item]}
        onPress={() =>
          Alert.alert(
            item.title,
            `Moment scheduled for ${item.duration}min at ${
              item.timestampFormatted.split(" at ")[1]
            }`,
            [
              { text: "Edit", onPress: () => onEditMoment(item) },
              {
                text: "Delete",
                onPress: () => onDeleteMoment(item),
              },
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
                style: "cancel",
              },
            ],
            { cancelable: false }
          )
        }
      >
        <Text style={{ color: "#EFEFEF" }}>{item.title}</Text>
        <Text style={{ color: "#EFEFEF" }}>{`for ${item.duration}min at ${
          item.timestampFormatted.split(" at ")[1]
        }`}</Text>
      </TouchableOpacity>
    );
  }

  function renderNoItems() {
    return (
      <View style={[styles.noMoments]}>
        <Text style={{ fontSize: 20, fontFamily: "montserrat-medium" }}>
          No moments planned
        </Text>
      </View>
    );
  }

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
      <Text style={styles.pageTitle}>Moments</Text>
      {isLoading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#509C96" />
        </View>
      )}
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Agenda
          items={moments}
          renderItem={renderItem}
          renderEmptyData={renderNoItems}
          onCalendarToggled={(calendarOpened) => {
            console.log(calendarOpened);
          }}
          onDayPress={(day) => {
            console.log("day pressed");
            setSelectedDay(day);
          }}
          onDayChange={(day) => {
            console.log("day changed");
            setSelectedDay(day);
          }}
          selected={selectedDay}
          pastScrollRange={50}
          futureScrollRange={50}
          rowHasChanged={(r1, r2) => {
            return r1.text !== r2.text;
          }}
          hideKnob={false}
          theme={{
            agendaDayTextColor: "#191919",
            agendaDayNumColor: "green",
            agendaTodayColor: "red",
            agendaKnobColor: "blue",
          }}
          // Agenda container style
          theme={{
            "stylesheet.agenda.list": {
              container: {},
            },
          }}
        />
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          NavigationService.navigate("NewMoment", {
            onGoBack: () => {
              console.log("went back to Agenda");
            },
          })
        }
      >
        <MaterialCommunityIcons name="plus-circle" size={50} color="#509C96" />
      </TouchableOpacity>
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
    backgroundColor: "#2C239A",
  },
  item: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C239A",
    padding: 10,
    borderRadius: 10,
  },
  noMoments: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#2C239A",
    padding: 10,
    borderRadius: 10,
  },
  calendar: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    color: "#160C21",
    alignSelf: "center",
    fontFamily: "montserrat-medium",
  },
  momentWidget: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    elevation: 10,
    display: "flex",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
});
