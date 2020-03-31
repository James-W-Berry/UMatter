import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
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
import { SafeAreaView } from "react-navigation";
import firebase from "../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function useMoments(currentMonth) {
  console.log(currentMonth);
  const [moments, setMoments] = useState({});
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("moments")
      // .where("month of timestamp field", "==", "currentMonth")
      .onSnapshot(snapshot => {
        const retrievedMoments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setMoments(retrievedMoments);
      });

    return () => unsubscribe();
  }, []);

  let test = {
    "2020-03-30": [{ name: "Item1", time: "10am-11am", with: "Erin" }],
    "2020-03-30": [{ name: "item 2- any js object" }],
    "2020-03-31": [{ name: "item 3 - any js object" }]
  };

  return test;
}

export default function Moments() {
  const [sortBy, setSortBy] = useState("");
  const moments = useMoments(sortBy);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [showActionButton, setShowActionButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState();
  const [items, setItems] = useState({});
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
    console.log(status);
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

  function createMomentWidget(item) {
    if (item !== undefined) {
      const key = item[0];
      const data = JSON.parse(item[1]);
      console.log(data);
      return (
        <View key={key} style={styles.momentWidget}>
          <MomentWidget
            id={key}
            moment={data}
            deleteMoment={deleteMoment}
            selectedDate={selectedDay}
          />
        </View>
      );
    }
    return null;
  }

  const onDayPress = day => {
    setSelected(day.dateString);
  };

  function loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const date = new Date(time);
        const strTime = date.toISOString().split("T")[0];
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Hello Name",
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 1000);
  }

  function renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} translucent={true} />
      <Text style={styles.pageTitle}>Moments</Text>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Agenda
          items={items}
          // loadItemsForMonth={month => {
          //   console.log(month);
          //   setSortBy(month);
          // }}
          renderItem={renderItem}
          loadItemsForMonth={loadItems}
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
          style={{
            backgroundColor: "#3E31B1"
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
    </SafeAreaView>
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
  calendar: {
    flex: 1
  },
  dayView: {
    flex: 1
  },
  momentSummary: {
    flex: 1,
    borderTopLeftRadius: 120,
    backgroundColor: "#EFEFEF",
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 1.0,
    shadowRadius: 0,
    shadowColor: "#3E31B1"
  },
  pageTitle: {
    fontSize: 24,
    color: "#EFEFEF",
    alignSelf: "center",
    fontFamily: "montserrat-regular"
  },
  selectPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 32
  },
  momentWidget: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  button: {
    elevation: 10,
    display: "flex",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"
  }
});
