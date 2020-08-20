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
  Keyboard,
  ScrollView
} from "react-native";
import Toast from "react-native-simple-toast";
import { Actions } from "react-native-router-flux";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { ContextConsumer } from "../contextApi";
import NavBar from "../navBar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { apiUrl } from "../config";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class VerifyEmail extends React.Component {
  state = {
    value1: "",
    txtInput1: "",
    txtInput2: "",
    txtInput3: "",
    txtInput4: "",
    txtInput5: "",
    loading: false,
    resending: false,
    keyboardViewHeight: 0
  };
  constructor(props) {
    super(props);
    this.animate = new Animated.Value(0);
  }
  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.setState({ value1: this.props.data });
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
                  <Animated.View //.....................animate
                    style={{
                      width: screenWidth - 60,
                      height: screenHeight / 3 + 100,
                      backgroundColor: "white",
                      borderRadius: 7,
                      position: "absolute",
                      right: 30,
                      top: bottomPosition
                    }}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={["rgb(0,193,156)", "rgb(34,110,173)"]}
                      style={{ flex: 1, borderRadius: 7 }}
                    >
                      <View
                        style={{
                          flex: 0.6,
                          justifyContent: "flex-end",
                          alignItems: "center",
                          paddingBottom: 6
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 32,
                            color: "#fff",
                            textTransform: "uppercase",
                            fontFamily: "Montserrat-Bold"
                          }}
                        >
                          {I18n.t("welcome")}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.6,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#fff",
                            fontFamily: "Montserrat-Regular",
                            textAlign: "center"
                          }}
                        >
                          {I18n.t("thanksV")}
                        </Text>
                      </View>
                      <View //..........................txtInput
                        style={{
                          flex: 0.8,
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "flex-end"
                        }}
                      >
                        <TextInput //..........txtinput1
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
                        />
                      </View>
                      <View //.......................resend
                        style={{
                          flex: 0.5,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row"
                        }}
                      >
                        <Text style={{ color: "#42aec2" }}>
                          If you didn't receive the code ?
                        </Text>
                        <TouchableOpacity
                          disabled={this.state.resending}
                          onPress={() => {
                            this.setState({ resending: true });
                            fetch(`${apiUrl}verify/email`, {
                              method: "POST",
                              headers: {
                                authorization:
                                  "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                Accept: "application/json",
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                email: this.props.email,
                                phone: this.props.phone,
                                password: this.props.password,
                                legalName: this.props.legalName,
                                initiatedName: this.props.initiatedName,
                                address: "",
                                country: this.props.country,
                                continent: this.props.continent,
                                panNo: this.props.panNo
                              })
                            })
                              .then(response => {
                                const statusCode = response.status;
                                const data = response.json();
                                return Promise.all([statusCode, data]);
                              })
                              .then(([status, data]) => {
                                //this.loadingController(false);
                                this.setState({
                                  loading: false,
                                  resending: false
                                });
                                if (status == 400 || status == 403) {
                                  Toast.show(data.message, Toast.LONG);
                                } else if (status == 404) {
                                  Toast.show(data.message, Toast.LONG);
                                } else if (status == 500) {
                                  Toast.show(data.message, Toast.LONG);
                                } else if (status == 200) {
                                  this.setState({ value1: data });
                                }
                              })
                              .catch(error => {
                                Toast.show(error, Toast.LONG);
                              });
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textDecorationLine: this.state.resending
                                ? "none"
                                : "underline",
                              fontSize: widthPercentageToDP("3.5%")
                            }}
                          >
                            {" "}
                            {this.state.resending ? "Resending" : "Resend"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View //..................btn
                        style={{
                          flex: 1.3,

                          justifyContent: "flex-start",
                          alignItems: "center",
                          paddingTop: 8
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
                              Verifing OTP
                            </Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              let value2 =
                                this.state.txtInput1 +
                                this.state.txtInput2 +
                                this.state.txtInput3 +
                                this.state.txtInput4 +
                                this.state.txtInput5;
                              if (this.state.value1 == value2) {
                                this.setState({ loading: true });
                                value.verifyEmail(
                                  this.props.email,
                                  this.props.phone,
                                  this.props.password,
                                  this.props.legalName,
                                  this.props.initiatedName,
                                  this.props.address,
                                  this.props.country,
                                  this.props.continent,
                                  this.props.panNo,
                                  this.props.referralCode,
                                  this.props.countryId
                                );
                              } else {
                                Toast.show("OTP doesn't match", Toast.LONG);
                              }
                            }}
                            style={[styles.btnV]}
                          >
                            <Text style={styles.btnTxt}>
                              {I18n.t("verifyEmail")}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </LinearGradient>
                  </Animated.View>
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
    width: "90%",
    height: hp("8%"),
    borderRadius: 5,
    marginTop: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#42aec2"
  },

  btnTxt: {
    fontSize: 17,
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
