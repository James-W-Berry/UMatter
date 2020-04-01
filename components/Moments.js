import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  AsyncStorage,
  KeyboardAvoidingView,
  Alert,
  Text,
  StatusBar
} from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import uuid from "uuid";
import { Icon } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MomentWidget from "./MomentWidget";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import NavigationService from "./NavigationService";
import DateTimePicker from "react-native-modal-datetime-picker";
import firebase from "../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeArea } from "react-native-safe-area-context";

function useMoments() {
  const [moments, setMoments] = useState({});
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      .onSnapshot(snapshot => {
        const retrievedMoments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        let formattedMoments = {};

        retrievedMoments.forEach(moment => {
          const time = new Date(moment.timestamp);
          const strTime = time.toISOString().split("T")[0];

          if (!formattedMoments[strTime]) {
            formattedMoments[strTime] = [];
          }
          formattedMoments[strTime].push({
            name: moment.title,
            time: moment.timestampFormatted,
            duration: moment.duration
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
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  function handleDatePicked() {
    console.log("A date has been picked: ", date);
    hideDateTimePicker();
  }

  async function saveNewMoment(date) {
    try {
      const momentId = `moment_${selectedDay}_${uuid.v4()}`;

      const newMoment = {
        title: "",
        date: selectedDay,
        time: date,
        series: "",
        id: momentId
      };

      await AsyncStorage.setItem(momentId, JSON.stringify(newMoment))
        .then(() => {
          console.log(`new scheduled moment saved to storage: `);
          console.log(newMoment);
          setShowScheduler(false);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e.message);
    }
    setShowActionButton(true);
  }

  function deleteMoment(key) {
    try {
      console.log(`deleting moment ${key}`);
      AsyncStorage.removeItem(key).then(response => {
        console.log(response);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  function handleDatePicked() {
    hideDateTimePicker();
    saveNewMoment(date);
  }

  function onEditMoment(moment) {
    console.log(moment);
    NavigationService.navigate("EditMoment", {
      moment,
      onGoBack: () => {
        console.log("went back to moments");
      }
    });
  }

  function renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item]}
        onPress={() =>
          Alert.alert(
            item.name,
            `Moment scheduled for ${item.duration}min at ${
              item.time.split(" at ")[1]
            }`,
            [
              { text: "Edit", onPress: () => onEditMoment(item) },
              {
                text: "Delete",
                onPress: () => console.log("delete")
              },
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
                style: "cancel"
              }
            ],
            { cancelable: false }
          )
        }
      >
        <Text style={{ color: "#EFEFEF" }}>{item.name}</Text>
        <Text style={{ color: "#EFEFEF" }}>{`for ${item.duration}min at ${
          item.time.split(" at ")[1]
        }`}</Text>
      </TouchableOpacity>
    );
  }

  function renderNoItems() {
    return (
      <View style={[styles.item]}>
        <Text style={{ color: "#EFEFEF" }}>No moments planned</Text>
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
        paddingTop: insets.top
      }}
    >
      <StatusBar barStyle={"light-content"} translucent={true} />
      <Text style={styles.pageTitle}>Moments</Text>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Agenda
          items={moments}
          renderItem={renderItem}
          renderEmptyData={renderNoItems}
          onCalendarToggled={calendarOpened => {
            console.log(calendarOpened);
          }}
          onDayPress={day => {
            console.log("day pressed");
            setSelectedDay(day);
          }}
          onDayChange={day => {
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
            agendaKnobColor: "blue"
          }}
          // Agenda container style
          theme={{
            "stylesheet.agenda.list": {
              container: {}
            }
          }}
        />
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          NavigationService.navigate("NewMoment", {
            onGoBack: () => {
              console.log("went back to Agenda");
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
    backgroundColor: "#2C239A"
  },
  item: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C239A",
    padding: 10,
    borderRadius: 10
  },
  calendar: {
    flex: 1
  },
  pageTitle: {
    fontSize: 24,
    color: "#160C21",
    alignSelf: "center",
    fontFamily: "montserrat-regular"
  },
  momentWidget: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center"
  },
  button: {
    elevation: 10,
    display: "flex",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  }
});
