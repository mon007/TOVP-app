import React from "react";
import {
  View,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Dimensions,
  Text,
  StatusBar,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";
import { primaryColor } from "./config";

export default class SplashScreen extends React.Component {
  state = {
    activityIndicator: true,
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <ImageBackground
          source={require("../src/buddha.png")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <ActivityIndicator
            animating={this.state.activityIndicator}
            color="#fff"
            size={Platform.OS === "android" ? widthPercentageToDP(5) : 1}
          /> */}

          <View
            style={{
              width: widthPercentageToDP(20),
              height: widthPercentageToDP(20),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "#fff" }}>Loading... </Text>
            <WaveIndicator
              color="#fff"
              size={widthPercentageToDP(6)}
              waveMode="outline"
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
