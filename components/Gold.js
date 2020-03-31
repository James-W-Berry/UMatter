import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  AsyncStorage,
  ScrollView,
  FlatList,
  StatusBar
} from "react-native";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import FileWidget from "./FileWidget.js";

export default function Gold() {
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    retrieveFiles();
  }, []);

  function createFileWidget(item) {
    if (item !== undefined) {
      const key = item[0];
      const data = JSON.parse(item[1]);
      console.log(data);
      return (
        <View key={key} style={styles.fileWidget}>
          <FileWidget id={key} file={data} />
        </View>
      );
    }
    return null;
  }

  function retrieveFiles() {
    try {
      AsyncStorage.getAllKeys().then(async keys => {
        let fileKeys = [];

        for (const key in keys) {
          fileKeys.push(keys[key]);
        }
        await AsyncStorage.multiGet(fileKeys).then(result => {
          setFiles(result);
        });
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} translucent={true} />
      <View style={styles.fileViewer}>
        {showFiles && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              alignSelf: "flex-end",
              flexGrow: 1,
              height: "100%"
            }}
            horizontal={true}
          >
            <FlatList
              data={files}
              contentContainerStyle={{
                flexDirection: "row",
                flexGrow: 1,
                margin: 20
              }}
              renderItem={({ item }) => createFileWidget(item)}
              keyExtractor={index => index.toString()}
            />
          </ScrollView>
        )}
      </View>
      <View style={styles.animationContainer}>
        <TouchableOpacity
          style={styles.animation}
          onPress={() => {
            showFiles === true
              ? this.animation.play(10, 0)
              : this.animation.play(30, 50);
            setShowFiles(!showFiles);
          }}
        >
          <LottieView
            style={styles.animation}
            ref={animation => {
              this.animation = animation;
            }}
            source={require("./treasure.json")}
            autoPlay={false}
            loop={false}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2C239A"
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C239A"
  },
  fileViewer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C239A"
  },
  fileWidget: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  },
  animation: {
    flex: 1,
    justifyContent: "center",
    width: "50%",
    height: "50%"
  }
});
