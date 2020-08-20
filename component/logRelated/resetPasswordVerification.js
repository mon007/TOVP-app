import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
  Keyboard
} from "react-native";
import Toast from "react-native-simple-toast";
import { Actions } from "react-native-router-flux";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { ContextConsumer } from "../contextApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { apiUrl } from "../config";
import NetInfo from "@react-native-community/netinfo";
import NavBar from "../navBar";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class ResetPasswordVerification extends React.Component {
  state = {
    txtInput: "",
    resendCode: null,
    keyboardViewHeight: 0
    // txtInput1: "",
    // txtInput2: "",
    // txtInput3: "",
    // txtInput4: "",
    // txtInput5: ""
  };
  constructor(props) {
    super(props);
    this.animate = new Animated.Value(0);
  }
  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Animated.spring(this.animate, {
      toValue: 1,
      speed: 1
    }).start();
  }
  _keyboardDidShow = e => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };
  _keyboardDidHide = e => {
    this.setState({ keyboardViewHeight: 0 });
  };
  render() {
    const bottomPosition = this.animate.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight, 0]
    });
    return (
      <React.Fragment>
        <StatusBar hidden={true} />
        <ContextConsumer>
          {value => (
            <ImageBackground
              style={{ flex: 1 }}
              blurRadius={0.8}
              source={require("../../src/buddha.png")}
            >
              <ScrollView
                style={{ width: screenWidth, height: screenHeight }}
                showsVerticalScrollIndicator={false}
              >
                <View style={{ width: "100%", height: 0.4 * screenHeight }}>
                  {Platform.OS === "ios" ? (
                    <View style={{ width: "100%", height: 18 }} />
                  ) : null}
                  <ImageBackground
                    source={require("../../src/logo.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain"
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <React.Fragment>
                        <NavBar
                          title=""
                          noRightBtn={true}
                          back={true}
                          color="rgba(0,0,0,0)"
                          titleColor="white"
                        />
                      </React.Fragment>
                    ) : null}
                  </ImageBackground>
                </View>
                {/* <View
            style={{
              flex: 0.5,
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          /> */}
                <View
                  style={{
                    width: "100%",
                    height: 0.6 * screenHeight,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingBottom: 6
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        color: "#fff",
                        textTransform: "uppercase",
                        fontFamily: "Montserrat-Bold"
                      }}
                    >
                      {I18n.t("Verification")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 10,
                      paddingRight: 10
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#fff",
                        fontFamily: "Montserrat-Regular",
                        textAlign: "center"
                      }}
                    >
                      {I18n.t("phoneProceed")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: screenWidth,
                      aspectRatio: 5 / 1,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "flex-end"
                    }}
                  >
                    <TextInput //..........txtinput
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        height: "70%",
                        color: "#fff",
                        fontSize: wp("3.6%"),
                        backgroundColor: "rgba(0,0,0,0.52)",
                        paddingLeft: 18
                      }}
                      placeholder="Verification Code..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={this.state.txtInput}
                      onChangeText={txt => {
                        this.setState({ txtInput: txt });
                      }}
                      maxLength={5}
                      //blurOnSubmit={false}
                      keyboardType="number-pad"
                    />
                    {/* <TextInput //..........txtinput1
                    style={styles.txtInput}
                    value={this.state.txtInput1}
                    onChangeText={txt => {
                      this.setState({ txtInput1: txt });
                      if (/^[0-9][0-9]*([.][0-9]{2}|)$/.test(txt)) {
                        this.txtInput2.focus();
                      }
                    }}
                    ref={input => {
                      this.txtInput1 = input;
                    }}
                    maxLength={1}
                    blurOnSubmit={false}
                    keyboardType="number-pad"
                  />
                  <TextInput //..........txtinput2
                    style={styles.txtInput}
                    value={this.state.txtInput2}
                    onChangeText={txt => {
                      this.setState({ txtInput2: txt });
                      if (/^[0-9][0-9]*([.][0-9]{2}|)$/.test(txt)) {
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
                    keyboardType="number-pad"
                  />
                  <TextInput //..........txtinput3
                    style={styles.txtInput}
                    value={this.state.txtInput3}
                    onChangeText={txt => {
                      this.setState({ txtInput3: txt });
                      if (/^[0-9][0-9]*([.][0-9]{2}|)$/.test(txt)) {
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
                    keyboardType="number-pad"
                  />
                  <TextInput //...........txtinput4
                    style={styles.txtInput}
                    value={this.state.txtInput4}
                    onChangeText={txt => {
                      this.setState({ txtInput4: txt });
                      if (/^[0-9][0-9]*([.][0-9]{2}|)$/.test(txt)) {
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
                    keyboardType="number-pad"
                  />
                  <TextInput //............txtinput5
                    style={styles.txtInput}
                    value={this.state.txtInput5}
                    onChangeText={txt => {
                      this.setState({ txtInput5: txt });
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
                    keyboardType="number-pad"
                  /> */}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 10,
                      paddingRight: 10,
                      flexDirection: "row"
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontFamily: "Montserrat-Regular",
                        fontSize: wp("3.3%")
                      }}
                    >
                      {I18n.t("resend1")}{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ loading: true });
                        let url =
                          apiUrl +
                          "user/reset-password?email=" +
                          this.props.email;
                        unsubscribe1 = NetInfo.addEventListener(state => {
                          if (state.isConnected) {
                            fetch(url)
                              .then(response => {
                                const statusCode = response.status;
                                const data = response.json();
                                return Promise.all([statusCode, data]);
                              })
                              .then(([statusCode, data]) => {
                                this.setState({ loading: false });
                                if (statusCode == 200) {
                                  this.setState({ resendCode: data });
                                } else {
                                  Toast.show(data.message, Toast.LONG);
                                  this.setState({ loading: false });
                                }
                              });
                          } else {
                            alert("Network error");
                          }
                        });
                        unsubscribe1();
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Montserrat-Regular",
                          fontSize: wp("3.3%"),
                          textDecorationLine: "underline"
                        }}
                      >
                        {I18n.t("resend2")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View //...........................verify
                    style={{
                      flex: 2,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      paddingTop: 28
                    }}
                  >
                    {this.state.loading ? (
                      <View style={{ flexDirection: "row" }}>
                        <ActivityIndicator
                          color="#fff"
                          animating={this.state.loading}
                          size={Platform.OS === "android" ? 18 : 1}
                        />
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 18,
                            paddingLeft: 10
                          }}
                        >
                          Resending Code
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          let value1 = this.state.resendCode
                            ? this.state.resendCode
                            : this.props.data;
                          let value2 = this.state.txtInput;

                          if (value1 == value2) {
                            Actions.replace("resetPasswordReset", {
                              email: this.props.email
                            });
                          } else {
                            Toast.show("Invalid Code", Toast.LONG);
                          }
                        }}
                        style={styles.btnV}
                      >
                        <Text style={styles.btnTxt}>{I18n.t("verify")}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: this.state.keyboardViewHeight
                  }}
                />
              </ScrollView>
            </ImageBackground>
          )}
        </ContextConsumer>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  btnV: {
    width: 138,
    height: 50,
    borderRadius: 5,
    marginTop: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#42aec2"
  },

  btnTxt: {
    fontSize: wp("3.5%"),
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold"
  },
  txtInput: {
    width: "15%",
    height: "70%",
    borderRadius: 5,
    color: "#fff",
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0.52)",
    paddingLeft: 22
  }
});
