import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { IconButton, Divider } from "react-native-paper";

export default function Event(props) {
  let event = props.navigation.state.params.event;

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 20,
          }}
        >
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.caption}>{event.description}</Text>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            height: "25%",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: event.image,
            }}
          />
        </View>
        <Divider style={{ width: "100%" }} />

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 20,
          }}
        >
          <Text style={styles.caption}>{event.date}</Text>
          <Text style={styles.caption}>{event.time}</Text>
        </View>
        <Divider style={{ width: "100%" }} />
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 20,
            flex: 1,
            flexDirection: "column",
          }}
        >
          <Text style={styles.caption}>
            {`Here's more information about the event\n-location of event\n-could include things to prepare for before joining \n-any supporting materials (could link to resources)\n-event organizer contact info`}
          </Text>
        </View>

        <Divider style={{ width: "100%" }} />

        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 20,
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              icon="account-group"
              color={"#00A9A5"}
              size={20}
              style={{ margin: 0, marginLeft: -5 }}
              onPress={() => console.log("Show attendees")}
            />
            <Text style={styles.date}>{event.attendees.length}</Text>
          </View>

          <Button
            onclick={() => {
              console.log("increment one to sign");
            }}
            title={`Sign up for ${event.title}`}
            color="#509C96"
            accessibilityLabel="sign up for event"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: "montserrat-medium",
  },
  caption: {
    fontSize: 16,
    fontFamily: "montserrat-regular",
    textAlign: "center",
  },
  date: {
    fontSize: 16,
    fontFamily: "montserrat-regular",
  },
});
