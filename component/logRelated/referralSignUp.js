import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "../contextApi";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { sha256 } from "react-native-sha256";
import { Actions } from "react-native-router-flux";
import NetInfo from "@react-native-community/netinfo";
import { apiUrl } from "../config";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";

let unsubscribe1;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);

export default class ReferralSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animatedLoading = new Animated.Value(0);
    this.myInt;
  }
  state = {
    email: "",
    loading: false,
    emailValidation: false,
    txtInput: "",
    // txtInput1: "",
    // txtInput2: "",
    // txtInput3: "",
    // txtInput4: "",
    // txtInput5: ""
  };

  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 1,
      //useNativeDriver: true,
    }).start();
  }
  // componentWillUnmount() {
  //   this.unsubscribe();
  // }
  loadingController = (setTime) => {
    if (setTime) {
      let value = 0;
      this.myInt = setInterval(() => {
        value = !value;
        Animated.spring(this.animatedLoading, {
          toValue: value,
          speed: 2,
        }).start();
      }, 500);
    } else {
      clearInterval(this.myInt);
      Animated.spring(this.animatedLoading, {
        toValue: 0,
        speed: 2,
      }).start();
    }
  };
  _keyboardDidShow = (e) => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };
  _keyboardDidHide = (e) => {
    this.setState({ keyboardViewHeight: 0 });
  };
  render() {
    const animatedWidth = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [-180, screenWidth / 2 - 90],
    });
    const animatedBorderColor = this.animatedLoading.interpolate({
      inputRange: [0, 1],
      outputRange: ["#42aec2", "#619ce0"],
    });
    return (
      <ContextConsumer>
        {(value) => {
          return (
            <React.Fragment>
              <StatusBar hidden={true} />

              <ScrollView
                style={{ width: screenWidth, height: screenHeight }}
                showsVerticalScrollIndicator={false}
              >
                <View style={{ width: "100%", height: 0.4 * screenHeight }}>
                  <Image
                    source={require("../../src/buddha11.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                </View>
                <LinearGradient
                  style={{
                    width: "100%",
                    height: 0.6 * screenHeight,
                    overflow: "visible",
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["rgb(0,150,165)", "rgb(34,110,173)"]}
                >
                  <View style={{ width: "100%", aspectRatio: 5 / 1.5 }}>
                    <Image
                      source={require("../../src/logo12.png")}
                      style={{
                        width: 250,
                        height: 160,
                        position: "absolute",
                        right: (screenWidth - 250) / 2,
                        top: -65,
                      }}
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingLeft: 20,
                      }}
                    >
                      <Text style={styles.txt1}>{I18n.t("referralCode")}</Text>
                    </View>
                    <View style={{ flex: 1.7 }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <TextInput //..........txtinput
                          style={{
                            width: "90%",
                            alignSelf: "center",
                            height: hp("8%"),
                            color: "#fff",
                            fontSize: wp("3.6%"),
                            backgroundColor: "rgba(0,0,0,0.52)",
                            paddingLeft: 18,
                          }}
                          placeholder="Referral Code..."
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          value={this.state.txtInput}
                          onChangeText={(txt) => {
                            this.setState({ txtInput: txt });
                          }}
                          maxLength={5}
                          //blurOnSubmit={false}
                        />
                        {/* <TextInput //..........txtinput1
                          style={styles.txtInput}
                          value={this.state.txtInput1}
                          onChangeText={txt => {
                            this.setState({ txtInput1: txt.toUpperCase() });
                            if (/^[a-zA-Z0-9]+$/.test(txt)) {
                              this.txtInput2.focus();
                            }
                          }}
                          ref={input => {
                            this.txtInput1 = input;
                          }}
                          maxLength={1}
                          blurOnSubmit={false}
                          autoCapitalize="characters"
                        />
                        <TextInput //..........txtinput2
                          style={styles.txtInput}
                          value={this.state.txtInput2}
                          onChangeText={txt => {
                            this.setState({ txtInput2: txt.toUpperCase() });
                            if (/^[a-zA-Z0-9]+$/.test(txt)) {
                              this.txtInput3.focus();
                            }
                          }}
                          onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                            if (keyValue === "Backspace") {
                              this.txtInput1.focus();
                            }
                          }}
                          maxLength={1}
                          blurOnSubmit={false}
                          ref={input => {
                            this.txtInput2 = input;
                          }}
                          autoCapitalize="characters"
                        />
                        <TextInput //..........txtinput3
                          style={styles.txtInput}
                          value={this.state.txtInput3}
                          onChangeText={txt => {
                            this.setState({ txtInput3: txt.toUpperCase() });
                            if (/^[a-zA-Z0-9]+$/.test(txt)) {
                              this.txtInput4.focus();
                            }
                          }}
                          onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                            if (keyValue === "Backspace") {
                              this.txtInput2.focus();
                            }
                          }}
                          maxLength={1}
                          blurOnSubmit={false}
                          ref={input => {
                            this.txtInput3 = input;
                          }}
                          autoCapitalize="characters"
                        />
                        <TextInput //...........txtinput4
                          style={styles.txtInput}
                          value={this.state.txtInput4}
                          onChangeText={txt => {
                            this.setState({ txtInput4: txt.toUpperCase() });
                            if (/^[a-zA-Z0-9]+$/.test(txt)) {
                              this.txtInput5.focus();
                            }
                          }}
                          onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                            if (keyValue === "Backspace") {
                              this.txtInput3.focus();
                            }
                          }}
                          maxLength={1}
                          blurOnSubmit={false}
                          ref={input => {
                            this.txtInput4 = input;
                          }}
                          autoCapitalize="characters"
                        />
                        <TextInput //............txtinput5
                          style={styles.txtInput}
                          value={this.state.txtInput5}
                          onChangeText={txt => {
                            this.setState({ txtInput5: txt.toUpperCase() });
                          }}
                          onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                            if (keyValue === "Backspace") {
                              this.txtInput4.focus();
                            }
                          }}
                          maxLength={1}
                          ref={input => {
                            this.txtInput5 = input;
                          }}
                          autoCapitalize="characters"
                        /> */}
                      </View>
                    </View>
                  </View>
                  <View //...Next
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <AnimatedBtn //...................next
                      onPress={() => {
                        if (
                          this.state.txtInput
                          // this.state.txtInput1 &&
                          // this.state.txtInput2 &&
                          // this.state.txtInput3 &&
                          // this.state.txtInput4 &&
                          // this.state.txtInput5
                        ) {
                          let value1 = this.state.txtInput;
                          // this.state.txtInput1 +
                          // this.state.txtInput2 +
                          // this.state.txtInput3 +
                          // this.state.txtInput4 +
                          // this.state.txtInput5;
                          unsubscribe1 = NetInfo.addEventListener((state) => {
                            if (state.isConnected) {
                              fetch(apiUrl + "user/refer/" + value1)
                                .then((res) => {
                                  statusCode = res.status;
                                  data = res.json();
                                  return Promise.all([statusCode, data]);
                                })
                                .then(([statusCode, data]) => {
                                  if (statusCode == 200) {
                                    Actions.replace("signUp", {
                                      referralCode: value1,
                                    });
                                  } else {
                                    alert("Enter a valid Referral Code");
                                  }
                                })
                                .catch((e) => console.log(e));
                            } else {
                              alert("Network error");
                            }
                          });
                          unsubscribe1();
                        } else {
                          Toast.show("enter code", Toast.LONG);
                        }
                      }}
                      style={[
                        styles.btnV,
                        {
                          position: "absolute",
                          left: animatedWidth,
                          backgroundColor: animatedBorderColor,
                          // borderWidth: 1,
                          // borderColor: animatedBorderColor
                        },
                      ]}
                    >
                      <Text style={styles.btnTxt}>{I18n.t("next")}</Text>
                    </AnimatedBtn>
                  </View>

                  <View
                    style={{
                      flex: 1.5,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity ///...................Skip
                      style={[
                        styles.btnV,
                        { backgroundColor: "rgba(255,255,255,0.5)" },
                      ]}
                      onPress={() =>
                        Actions.replace("signUp", { referrelCode: "" })
                      }
                    >
                      <Text
                        style={{
                          color: "#454545",
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: 14,
                        }}
                      >
                        {I18n.t("skip")} >
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
                <View
                  style={{
                    width: "100%",
                    height: this.state.keyboardViewHeight,
                    backgroundColor: "rgb(34,110,173)",
                  }}
                />
              </ScrollView>
            </React.Fragment>
          );
        }}
      </ContextConsumer>
    );
  }
}
const styles = StyleSheet.create({
  v1: {
    flex: 0.5,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20,
  },
  txt1: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#fff",
  },
  v2: {
    backgroundColor: "rgba(0,0,0,0.52)",
    width: "95%",
    height: 70,
    margin: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingLeft: 18,
    paddingTop: 8,
    borderBottomColor: "#42aec2",
    borderBottomWidth: 1,
  },
  txtInput: {
    width: "15%",
    height: "40%",
    borderRadius: 5,
    color: "#fff",
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0.52)",
    paddingLeft: 22,
  },
  radioBtnV1: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioBtnV2: {
    height: 10,
    width: 10,
    borderRadius: 2,
  },
  radioTxt: { fontFamily: "Montserrat-Regular" },
  btnV: {
    marginTop: 18,
    width: 180,
    height: 40,
    borderRadius: 3,
    backgroundColor: "#42aec2",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    fontSize: 14,
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold",
  },
});
