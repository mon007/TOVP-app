import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import NavBar from "./navBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";
import { primaryColor, notificationUrl, apiUrl } from "./config";
import Toast from "react-native-simple-toast";
import { ProfileControllerConsumer } from "./profileController";

const deviceWidth = Dimensions.get("window").width;
const FIXED_BAR_WIDTH = 220;
const BAR_SPACE = 15;
var y;

export default class VisionTopSwip extends Component {
  state = {
    //title: this.state.data[0].title,
    data: [],
    numberOfNotification: 0,
  };
  numItems = this.state.data.length;
  itemWidth = 8; //FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  componentDidMount() {
    this.notificationCount();
    y = setInterval(() => {
      this.notificationCount();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(y);
  }

  notificationCount() {
    let url = `${notificationUrl}/${this.props.userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((numberOfNotification) => {
        //console.log(numberOfNotification);
        this.setState({ numberOfNotification });
      })
      .catch((e) => {
        console.log(e);
        //Toast.show("Something went wrong", Toast.LONG);
      });
  }

  render() {
    return (
      <React.Fragment>
        <ProfileControllerConsumer>
          {(value) => {
            let onGoingView = [];
            let barArray = [];
            value.data.forEach((data, i) => {
              const thisView = (
                <Image
                  key={`image${i}`}
                  style={{
                    width: widthPercentageToDP(100),
                    aspectRatio: 5 / 2.8,
                    resizeMode: "cover",
                  }}
                  source={{ uri: data.url }}
                />
              );
              onGoingView.push(thisView);

              const scrollBarVal = this.animVal.interpolate({
                inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
                outputRange: [-this.itemWidth, this.itemWidth],
                extrapolate: "clamp",
              });

              const thisBar = (
                <View
                  key={`bar${i}`}
                  style={[
                    styles.track,
                    {
                      width: this.itemWidth,
                      marginLeft: i === 0 ? 0 : BAR_SPACE,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.bar,
                      {
                        width: this.itemWidth,
                        transform: [{ translateX: scrollBarVal }],
                      },
                    ]}
                  />
                </View>
              );
              barArray.push(thisBar);
            });
            if (value.data.length > 0) {
              return (
                <View style={styles.container} flex={1}>
                  <View //Navbar View
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: 0,
                      width: "100%",
                      // backgroundColor:
                      //   Platform.OS === "android" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0)",
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <View
                        style={{
                          // position: "absolute",
                          // top: -(getStatusBarHeight(true) - 10),
                          height: getStatusBarHeight(true),
                          width: "100%",
                        }}
                      />
                    ) : null}
                    <NavBar
                      title={I18n.t("vision")}
                      //noRightBtn={true}
                      color="rgba(0,0,0,0.01)"
                      titleColor="white"
                      numberOfNotification={this.state.numberOfNotification}
                      //unread={this.state.unread}
                    />
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={10}
                    pagingEnabled
                    onScroll={Animated.event([
                      { nativeEvent: { contentOffset: { x: this.animVal } } },
                    ])}
                  >
                    {onGoingView}
                  </ScrollView>
                  <View style={styles.barContainer}>{barArray}</View>
                </View>
              );
            } else {
              return (
                <ImageBackground //Navbar View
                  style={{
                    width: "100%",
                    aspectRatio: 5 / 2.8,
                  }}
                  source={require("../src/vision1.jpg")}
                  imageStyle={{ resizeMode: "cover" }}
                >
                  {Platform.OS === "ios" ? (
                    <View
                      style={{
                        // position: "absolute",
                        // top: -(getStatusBarHeight(true) - 10),
                        height: getStatusBarHeight(true),
                        //backgroundColor: primaryColor,
                        width: "100%",
                      }}
                    />
                  ) : null}
                  <NavBar
                    title={I18n.t("vision")}
                    //noRightBtn={true}
                    color="rgba(0,0,0,0.01)"
                    titleColor="white"
                    numberOfNotification={this.state.numberOfNotification}
                    //unread={this.state.unread}
                  />
                </ImageBackground>
              );
            }
          }}
        </ProfileControllerConsumer>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 5 / 2.8,
    alignItems: "center",
    justifyContent: "center",
  },
  barContainer: {
    position: "absolute",
    zIndex: 2,
    bottom: 8,
    flexDirection: "row",
  },
  track: {
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    height: 8,
    borderRadius: 18,
  },
  bar: {
    backgroundColor: "#fff", //"#4095ff",
    height: 8,
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 18,
  },
});
