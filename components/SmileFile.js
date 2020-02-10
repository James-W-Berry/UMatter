import React, { Component } from "react";
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

export default class SmileFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      showFiles: false
    };
  }

  componentDidMount() {
    this.retrieveFiles();
  }

  createFileWidget(item) {
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

  retrieveFiles() {
    try {
      AsyncStorage.getAllKeys().then(async keys => {
        let fileKeys = [];

        for (const key in keys) {
          fileKeys.push(keys[key]);
        }
        await AsyncStorage.multiGet(fileKeys).then(result => {
          this.setState({ files: result });
        });
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"light-content"} translucent={true} />
        <View style={styles.fileViewer}>
          {this.state.showFiles && (
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
                data={this.state.files}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexGrow: 1,
                  margin: 20
                }}
                renderItem={({ item }) => this.createFileWidget(item)}
                keyExtractor={index => index.toString()}
              />
            </ScrollView>
          )}
        </View>
        <View style={styles.animationContainer}>
          <TouchableOpacity
            style={styles.animation}
            onPress={() => {
              this.state.showFiles === true
                ? this.animation.play(10, 0)
                : this.animation.play(30, 50);
              this.setState({ showFiles: !this.state.showFiles });
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#191919"
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191919"
  },
  fileViewer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191919"
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
