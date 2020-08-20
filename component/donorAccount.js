import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import NavBar from "./navBar";
import LinearGradient from "react-native-linear-gradient";
//import ViewPager from "@react-native-community/viewpager";
import Paid from "./paid";
import RecurringPayment from "./recurringPayment";
import ViewPager from "react-native-view-pager";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { widthPercentageToDP } from "react-native-responsive-screen";
import CompletedPledges from "./completedPledges";

const screenWidth = Dimensions.get("window").width;
const secondPosition = screenWidth / 3;
const thirdPosition = 2 * (screenWidth / 3);
const pages = ["Due/Overdue", "Donation Status", "Completed Pledges"];

export default class DonorAccount extends React.Component {
  state = {
    arr: [true, false, false],
  };
  componentWillMount() {
    this.animateLeft = new Animated.Value(0);
  }
  onPageScroll = (position, index) => {
    Animated.spring(this.animateLeft, {
      toValue: index + position,
      tension: 10,
      //useNativeDriver: true,
    }).start();
    let array = [].concat(this.state.arr);
    array[index] = true;
    for (i = 0; i < array.length; i++) {
      if (i != index) {
        array[i] = false;
      }
    }
    this.setState({ arr: array });
  };

  render() {
    const leftAnimated = this.animateLeft.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, secondPosition, thirdPosition],
    });
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
        <NavBar //.........................NavBar
          title="Donation Details"
          back={true}
          noRightBtn={true}
          color="#42aec2"
          titleColor="#fff"
        />
        <View //.........................TopTabBar
          style={{
            height: 50,
            width: "100%",
            flexDirection: "row",
            backgroundColor: "#42aec2",
          }}
        >
          {pages.map((item, index) => (
            <TouchableOpacity
              style={{
                width: screenWidth / pages.length,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this.viewPager.setPage(index)}
            >
              <Text
                style={{
                  color: this.state.arr[index] ? "#fff" : "#b3ffffff",
                  fontSize: widthPercentageToDP(3),
                  fontFamily: "Montserrat-SemiBold",
                  textAlign: "center",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ width: "100%", height: 3, backgroundColor: "#42aec2" }}>
          <Animated.View
            style={{
              width: screenWidth / pages.length,
              height: "100%",
              backgroundColor: "white",
              position: "absolute",
              //left: leftAnimated,
              transform: [{ translateX: leftAnimated }],
            }}
          />
        </View>
        <ViewPager //.....................ViewPager
          ref={(viewPager) => {
            this.viewPager = viewPager;
          }}
          style={styles.viewPager}
          onPageScroll={(e) =>
            this.onPageScroll(e.nativeEvent.offset, e.nativeEvent.position)
          }
          initialPage={0}
        >
          <View key="1" style={{ flex: 1 }}>
            <RecurringPayment
              userId={this.props.userId}
              country={this.props.country}
              recurringPaymentController={this.props.recurringPaymentController}
              autoCaptureRazorPay={this.props.autoCaptureRazorPay}
            />
          </View>
          <View key="2" style={{ flex: 1 }}>
            <Paid userId={this.props.userId} />
          </View>
          <View key="3" style={{ flex: 1 }}>
            <CompletedPledges userId={this.props.userId} />
          </View>
        </ViewPager>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
});
