import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

import { primaryColor } from "./config";

/**
 * countDownDate is the end date for TOVP donation.
 */
const countDownDate = new Date("Feb 13, 2022 10:00:00").getTime();
var x;

export default class VisionTimer extends React.Component {
  state = {
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
    started: false,
  };

  componentDidMount() {
    this.countDown();
  }

  componentWillUnmount() {
    clearInterval(x);
  }

  countDown = () => {
    x = setInterval(() => {
      // Get today's date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      this.setState({ days, hours, minutes, seconds, started: true });

      //console.log(distance);
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.setState({
          days: "",
          hours: "",
          minutes: "",
          seconds: "",
          started: true,
        });
      }
    }, 1000);
  };

  render() {
    return (
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          aspectRatio: 6 / 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View style={[styles.timerView, { backgroundColor: "#ffb74d" }]}>
          <Text style={styles.textTimer}>{this.state.days}</Text>
          <Text style={styles.textTimertxt}>days</Text>
        </View>
        <View style={[styles.timerView, { backgroundColor: "#ffb74d" }]}>
          <Text style={styles.textTimer}>{this.state.hours}</Text>
          <Text style={styles.textTimertxt}>hours</Text>
        </View>
        <View style={[styles.timerView, { backgroundColor: "#ffb74d" }]}>
          <Text style={styles.textTimer}>{this.state.minutes}</Text>
          <Text style={styles.textTimertxt}>minutes</Text>
        </View>
        <View style={[styles.timerView, { backgroundColor: "#ffb74d" }]}>
          <Text style={styles.textTimer}>{this.state.seconds}</Text>
          <Text style={styles.textTimertxt}>seconds</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  timerView: {
    height: "100%",
    width: widthPercentageToDP("20%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: primaryColor,
  },
  textTimer: {
    color: "#707070",
    fontSize: widthPercentageToDP("5%"),
    fontFamily: "Montserrat-Bold",
  },
  textTimertxt: {
    color: "#707070",
    fontSize: widthPercentageToDP("3%"),
    fontFamily: "Montserrat-SemiBold",
  },
});
