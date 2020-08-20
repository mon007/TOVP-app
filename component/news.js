import React from "react";
import { View, Text, Platform, StatusBar } from "react-native";
import NavBar from "./navBar";
// import NetInfo from "@react-native-community/netinfo";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { WebView } from "react-native-webview";

export default class News extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2",
            }}
          ></View>
        ) : null}

        <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        <NavBar
          title="News"
          color="#42aec2"
          titleColor="#fff"
          noRightBtn={true}
        />
        <WebView
          source={{ uri: "https://tovp.org/news-mobile/" }}
          style={{ flex: 1 }}
          onError={() => alert("Page Failed to Load.")}
          startInLoadingState={true}
        />
      </View>
    );
  }
}
