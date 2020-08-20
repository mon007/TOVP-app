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
  Platform,
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "../contextApi";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { sha256 } from "react-native-sha256";
import { Actions } from "react-native-router-flux";
import { apiUrl } from "../config";
import RNFetchBlob from "rn-fetch-blob";
import NavBar from "../navBar";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import NetInfo from "@react-native-community/netinfo";

let unsubscribe1;
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);

export default class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animatedLoading = new Animated.Value(0);
    this.myInt;
  }
  state = {
    secureTextEntry: true,
    email: "",
    password: "",
    loading: false,
    termsVisible: false,
    keyboardViewHeight: 0,
  };

  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 2,
    }).start();
  }

  _keyboardDidShow = (e) => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };
  _keyboardDidHide = (e) => {
    this.setState({ keyboardViewHeight: 0 });
  };

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
                <View style={{ width: wp("100%"), height: hp("20%") }}>
                  <ImageBackground
                    source={require("../../src/buddha11.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <React.Fragment>
                        <View style={{ width: "100%", height: 18 }} />
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
                <LinearGradient
                  style={{
                    width: wp("100%"),
                    height: hp("80%"),
                    overflow: "visible",
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["rgb(0,150,165)", "rgb(34,110,173)"]}
                >
                  <View
                    style={{
                      width: wp("100%"),
                      height: hp("14%"),
                    }}
                  >
                    <Image
                      source={require("../../src/logo12.png")}
                      style={{
                        width: 230,
                        height: 130,
                        position: "absolute",
                        right: (screenWidth - 230) / 2,
                        top: -50,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.3,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 20,
                      }}
                    >
                      <Text style={styles.txt1}>{I18n.t("existingUser")}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.v2}>
                        <Text style={styles.txt1}>{I18n.t("emailId")}</Text>
                        <TextInput
                          style={styles.txtInput}
                          value={this.state.email}
                          keyboardType="email-address"
                          ref={(input) => {
                            this.emailId = input;
                          }}
                          onSubmitEditing={() => this.password.focus()}
                          onChangeText={(txt) => this.setState({ email: txt })}
                        />
                      </View>
                      {/* .................................password */}
                      <View style={styles.v2}>
                        <Text style={styles.txt1}>{I18n.t("password")}</Text>
                        <View
                          style={{
                            width: "100%",
                            height: "80%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <TextInput
                            style={[
                              styles.txtInput,
                              { width: "88%", height: "100%" },
                            ]}
                            ref={(input) => {
                              this.password = input;
                            }}
                            secureTextEntry={this.state.secureTextEntry}
                            value={this.state.password}
                            onChangeText={(txt) =>
                              this.setState({ password: txt })
                            }
                          />
                          <TouchableOpacity
                            style={{
                              width: 40,
                              height: 40,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              this.setState({
                                secureTextEntry: !this.state.secureTextEntry,
                              });
                            }}
                          >
                            <Icon
                              name={
                                this.state.secureTextEntry ? "eye-off" : "eye"
                              }
                              size={16}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View //........forget
                      style={{
                        flex: 0.3,
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        paddingLeft: 18,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => Actions.push("resetPasswordPhone")}
                      >
                        <Text
                          style={{
                            color: "#ffffff",
                            fontFamily: "Montserrat-Regular",
                            fontSize: widthPercentageToDP("3.3%"),
                            textDecorationLine: "underline",
                          }}
                        >
                          {I18n.t("forgetPassword")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", height: 10 }} />
                    <View //...logIn
                      style={{
                        flex: 0.8,
                        justifyContent: "flex-start",
                        alignItems: "center",
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
                              paddingLeft: 10,
                            }}
                          >
                            Logging
                          </Text>
                        </View>
                      ) : (
                        <AnimatedBtn
                          onPress={() => {
                            unsubscribe1 = NetInfo.addEventListener((state) => {
                              if (state.isConnected) {
                                if (!this.state.loading) {
                                  if (this.state.email && this.state.password) {
                                    this.setState({ loading: true });
                                    this.loadingController(true);
                                    //console.log("yo11");
                                    sha256(this.state.password).then((hash) => {
                                      // RNFetchBlob.config({
                                      //   trusty: true
                                      // })
                                      fetch(`${apiUrl}user/signin`, {
                                        method: "POST",
                                        headers: {
                                          authorization:
                                            "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                          Accept: "application/json",
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          email: this.state.email.toLowerCase(),
                                          password: hash,
                                        }),
                                      })
                                        .then((response) => {
                                          const statusCode = response.status;
                                          const data = response.json();
                                          return Promise.all([
                                            statusCode,
                                            data,
                                          ]);
                                        })
                                        .then(([status, data]) => {
                                          this.loadingController(false);
                                          if (status == 400 || status == 403) {
                                            this.setState({ loading: false });
                                            Toast.show(
                                              data.message,
                                              Toast.LONG
                                            );
                                          } else if (status == 404) {
                                            this.setState({ loading: false });
                                            Toast.show(
                                              data.message,
                                              Toast.LONG
                                            );
                                          } else if (status == 500) {
                                            this.setState({ loading: false });
                                            Toast.show(
                                              data.message,
                                              Toast.LONG
                                            );
                                          } else if (status == 200) {
                                            value.changeLoggedStatus(data);
                                          }
                                        })
                                        .catch((error) => {
                                          Toast.show(error, Toast.LONG);
                                          this.setState({ loading: false });
                                        });
                                    });
                                  } else {
                                    Toast.show(
                                      "Fill the required fields",
                                      Toast.LONG
                                    );
                                  }
                                }
                              } else {
                                alert("Network error");
                              }
                            });
                            unsubscribe1();
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
                          disabled={this.state.loading}
                        >
                          <Text style={styles.btnTxt}>{I18n.t("logIn")}</Text>
                        </AnimatedBtn>
                      )}
                    </View>
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
    flex: 0.4,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 18,
  },
  txt1: {
    fontFamily: "Montserrat-Regular",
    fontSize: widthPercentageToDP("3.3%"),
    color: "#fff",
  },
  v2: {
    backgroundColor: "rgba(0,0,0,0.52)",
    width: "95%",
    height: hp("10%"),
    margin: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingLeft: 18,
    paddingTop: 8,
    borderBottomColor: "#42aec2",
    borderBottomWidth: 1,
  },
  txtInput: {
    width: "90%",
    height: "80%",
    color: "#fff",
    fontSize: widthPercentageToDP("3.4%"),
    fontFamily: "Montserrat-SemiBold",
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
    fontSize: widthPercentageToDP("3.3%"),
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold",
  },
});
