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
import ActionButton from "react-native-action-button";

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
          let time = new Date(
            moment.scheduledMomentTime.seconds * 1000 - moment.timeZoneOffset
          );

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
  const defaultItem = {
    title: "Your Moment",
    duration: "5",
  };

  useEffect(() => {
    getPermissionAsync();
    listenForNotifications();
  }, []);

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
    Notifications.addListener((notification) => {
      let info = "Start your moment!";
      Alert.alert(
        "UMatter",
        info,
        [
          {
            text: "Begin",
            onPress: () => {
              console.log(`starting moment: ${JSON.stringify(notification)}`);
              NavigationService.navigate("MomentVisualization", notification);
            },
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    });
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

    Notifications.cancelScheduledNotificationAsync(moment.id);

    const userId = firebase.auth().currentUser.uid;
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .doc(moment.id);

    docRef
      .delete()
      .then(() => {
        console.log(
          `successfully deleted moment entry ${docRef.id} from Firebase`
        );
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
              item.readableMomentTime.split(" at ")[1]
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
              {
                text: "Start now",
                onPress: () => {
                  console.log(`starting moment: ${JSON.stringify(item)}`);
                  NavigationService.navigate("MomentVisualization", item);
                },
              },
            ],
            { cancelable: false }
          )
        }
      >
        <Text style={{ color: "#EFEFEF" }}>{item.title}</Text>
        <Text style={{ color: "#EFEFEF" }}>{`for ${item.duration}min at ${
          item.readableMomentTime.split(" at ")[1]
        }`}</Text>
      </TouchableOpacity>
    );
  }

  function renderNoItems() {
    return (
      <View style={[styles.noMoments]}>
        <Text style={{ fontSize: 20, fontFamily: "montserrat-regular" }}>
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
            setSelectedDay(day);
          }}
          onDayChange={(day) => {
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
      <ActionButton buttonColor="#509C96">
        <ActionButton.Item
          buttonColor="#3E31B1"
          title="Start Moment Now"
          onPress={() =>
            NavigationService.navigate("MomentVisualization", defaultItem)
          }
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={35}
            color="#EDEDED"
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3E31B1"
          title="Schedule Moment"
          onPress={() =>
            NavigationService.navigate("NewMoment", {
              onGoBack: () => {
                console.log("went back to Agenda");
              },
            })
          }
        >
          <MaterialCommunityIcons name="calendar" size={35} color="#EDEDED" />
        </ActionButton.Item>
      </ActionButton>
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
    width: "40%",
    alignSelf: "center",
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
