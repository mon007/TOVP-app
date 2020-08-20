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
  ScrollView,
  Keyboard
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "../contextApi";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { sha256 } from "react-native-sha256";
import { Actions } from "react-native-router-flux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { apiUrl } from "../config";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);

export default class ResetPasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animatedLoading = new Animated.Value(0);
    this.myInt;
  }
  state = {
    newPassword: "",
    oldPassword: "",
    loading: false,
    passwordValidation1: false,
    passwordValidation2: false,
    keyboardViewHeight: 0
  };

  componentDidMount() {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 2
    }).start();
  }
  _keyboardDidShow = e => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };
  _keyboardDidHide = e => {
    this.setState({ keyboardViewHeight: 0 });
  };
  loadingController = setTime => {
    if (setTime) {
      let value = 0;
      this.myInt = setInterval(() => {
        value = !value;
        Animated.spring(this.animatedLoading, {
          toValue: value,
          speed: 2
        }).start();
      }, 500);
    } else {
      clearInterval(this.myInt);
      Animated.spring(this.animatedLoading, {
        toValue: 0,
        speed: 2
      }).start();
    }
  };
  render() {
    const animatedWidth = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [-180, screenWidth / 2 - 90]
    });
    const animatedBorderColor = this.animatedLoading.interpolate({
      inputRange: [0, 1],
      outputRange: ["#42aec2", "#619ce0"]
    });
    return (
      <ContextConsumer>
        {value => {
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
                      resizeMode: "cover"
                    }}
                  />
                </View>
                <LinearGradient
                  style={{
                    width: "100%",
                    height: 0.6 * screenHeight,
                    overflow: "visible"
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["rgb(0,150,165)", "rgb(34,110,173)"]}
                >
                  <View style={{ width: wp("100%"), height: hp("20%") }}>
                    <Image
                      source={require("../../src/logo12.png")}
                      style={{
                        width: 230,
                        height: 130,
                        position: "absolute",
                        right: (screenWidth - 230) / 2,
                        top: -50
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "flex-start",
                      paddingLeft: 20
                    }}
                  >
                    <Text style={styles.txt1}>{I18n.t("resetPassword")}</Text>
                  </View>
                  <View style={{ flex: 1.7 }}>
                    <View style={styles.v2}>
                      <Text style={styles.txt1}>{I18n.t("newPassword")}</Text>
                      <TextInput
                        style={styles.txtInput}
                        value={this.state.newPassword}
                        onChangeText={txt =>
                          this.setState({ newPassword: txt })
                        }
                        onEndEditing={e => {
                          if (e.nativeEvent.text.length < 8) {
                            Toast.show(
                              "Minimum eight characters required",
                              Toast.LONG,
                              Toast.BOTTOM
                            );
                            this.setState({
                              passwordValidation1: false
                            });
                          } else {
                            this.setState({
                              passwordValidation1: true
                            });
                          }
                        }}
                        //keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1.7 }}>
                    <View style={styles.v2}>
                      <Text style={styles.txt1}>
                        {I18n.t("confirmPassword")}
                      </Text>
                      <TextInput
                        style={styles.txtInput}
                        value={this.state.oldPassword}
                        onChangeText={txt =>
                          this.setState({ oldPassword: txt })
                        }
                        onEndEditing={e => {
                          if (e.nativeEvent.text.length < 8) {
                            Toast.show(
                              "Minimum eight characters required",
                              Toast.LONG,
                              Toast.BOTTOM
                            );
                            this.setState({
                              passwordValidation2: false
                            });
                          } else {
                            this.setState({
                              passwordValidation2: true
                            });
                          }
                        }}
                        //keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View //...logIn
                    style={{
                      flex: 1.4,
                      justifyContent: "flex-start",
                      alignItems: "center"
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
                          Reseting
                        </Text>
                      </View>
                    ) : (
                      <AnimatedBtn
                        onPress={() => {
                          if (
                            this.state.newPassword == this.state.oldPassword &&
                            this.state.passwordValidation1 &&
                            this.state.passwordValidation2
                          ) {
                            let url = `${apiUrl}user/reset-password`;
                            sha256(this.state.newPassword).then(hash => {
                              const unsubscribe1 = NetInfo.addEventListener(
                                state => {
                                  if (state.isConnected) {
                                    this.setState({ loading: true });
                                    fetch(url, {
                                      method: "PUT",
                                      headers: {
                                        authorization:
                                          "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify({
                                        email: this.props.email,
                                        password: hash
                                      })
                                    })
                                      .then(response => {
                                        const statusCode = response.status;
                                        const data = response.json();
                                        return Promise.all([statusCode, data]);
                                      })
                                      .then(([status, data]) => {
                                        this.setState({ loading: false });
                                        if (status == 200) {
                                          alert("Password Updated");
                                          Actions.popTo("logIn");
                                        } else {
                                          alert(data);
                                          //Toast.show(data, Toast.Long);
                                        }
                                      });
                                  } else {
                                    alert("Network error");
                                  }
                                }
                              );
                              unsubscribe1();
                            });
                          } else {
                            Toast.show("Password don't match", Toast.LONG);
                          }
                        }}
                        style={[
                          styles.btnV,
                          {
                            position: "absolute",
                            left: animatedWidth,
                            backgroundColor: animatedBorderColor
                            // borderWidth: 1,
                            // borderColor: animatedBorderColor
                          }
                        ]}
                      >
                        <Text style={styles.btnTxt}>{I18n.t("reset")}</Text>
                      </AnimatedBtn>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      height: 30,
                      width: "95%",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 10,
                      flexDirection: "row"
                    }}
                    onPress={() => Actions.replace("signUp")}
                  >
                    <Text
                      style={{
                        color: "#42aec2",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14
                      }}
                    >
                      {I18n.t("dontHaveAnAccount")}{" "}
                    </Text>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        textDecorationLine: "underline"
                      }}
                    >
                      {I18n.t("registerNow")}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View
                  style={{
                    width: "100%",
                    height: this.state.keyboardViewHeight,
                    backgroundColor: "rgb(34,110,173)"
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
    paddingLeft: 20
  },
  txt1: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#fff"
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
    borderBottomWidth: 1
  },
  txtInput: {
    width: "90%",
    height: "80%",
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold"
  },
  radioBtnV1: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },
  radioBtnV2: {
    height: 10,
    width: 10,
    borderRadius: 2
  },
  radioTxt: { fontFamily: "Montserrat-Regular" },
  btnV: {
    marginTop: 18,
    width: 180,
    height: 40,
    borderRadius: 3,
    backgroundColor: "#42aec2",
    justifyContent: "center",
    alignItems: "center"
  },
  btnTxt: {
    fontSize: 14,
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold"
  }
});
