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
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "../contextApi";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import { sha256 } from "react-native-sha256";
import { Actions } from "react-native-router-flux";
import NavBar from "../navBar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { apiUrl } from "../config";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const emailRegX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export default class ResetPasswordPhone extends React.Component {
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
  _keyboardDidShow = e => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };
  _keyboardDidHide = e => {
    this.setState({ keyboardViewHeight: 0 });
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
                  <ImageBackground
                    source={require("../../src/buddha11.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover"
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
                    width: "100%",
                    height: 0.6 * screenHeight,
                    overflow: "visible"
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
                        top: -65
                      }}
                    />
                  </View>
                  <View style={{ flex: 3.5 }}>
                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 20
                      }}
                    >
                      <Text style={styles.txt1}>
                        {I18n.t("forgetPassword")}
                      </Text>
                    </View>
                    <View style={{ flex: 1.7 }}>
                      <View style={styles.v2}>
                        <Text style={styles.txt1}>{I18n.t("emailId")}</Text>
                        <TextInput
                          style={styles.txtInput}
                          value={this.state.email}
                          onChangeText={txt =>
                            this.setState({ email: txt.toLowerCase() })
                          }
                          keyboardType="email-address"
                          onEndEditing={e => {
                            if (!emailRegX.test(e.nativeEvent.text)) {
                              Toast.show("Invalid Email", Toast.LONG);
                            }
                            console.log(emailRegX.test(e.nativeEvent.text));
                            this.setState({
                              emailValidation: emailRegX.test(
                                e.nativeEvent.text
                              )
                            });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View //...logIn
                    style={{
                      flex: 2,
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                  >
                    <AnimatedBtn
                      onPress={() => {
                        if (this.state.email && this.state.emailValidation) {
                          this.setState({ loading: true });
                          this.loadingController(true);
                          let url = `${apiUrl}user/reset-password?email=`;
                          const unsubscribe1 = NetInfo.addEventListener(
                            state => {
                              if (state.isConnected) {
                                fetch(url + this.state.email)
                                  .then(response => {
                                    const statusCode = response.status;
                                    const data = response.json();
                                    return Promise.all([statusCode, data]);
                                  })
                                  .then(([statusCode, data]) => {
                                    this.setState({ loading: false });
                                    this.loadingController(false);
                                    if (statusCode == 200) {
                                      Actions.push(
                                        "resetPasswordVerification",
                                        {
                                          data,
                                          email: this.state.email
                                        }
                                      );
                                    } else {
                                      Toast.show(data.message, Toast.LONG);
                                    }
                                  });
                              } else {
                                alert("Network error");
                              }
                            }
                          );
                          unsubscribe1();
                        } else {
                          Toast.show("Please Enter a valid Email", Toast.LONG);
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
                      <Text style={styles.btnTxt}>{I18n.t("verify")}</Text>
                    </AnimatedBtn>
                  </View>
                  <TouchableOpacity
                    style={{
                      height: 70,
                      width: "95%",
                      alignSelf: "center",
                      justifyContent: "center",
                      paddingLeft: 10,
                      flexDirection: "row"
                    }}
                    onPress={() => Actions.replace("signUp")}
                  >
                    <Text
                      style={{
                        color: "#42aec2",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.3%")
                      }}
                    >
                      {I18n.t("dontHaveAnAccount")}{" "}
                    </Text>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.3%"),
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
    flex: 0.5,
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
    height: 70,
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
