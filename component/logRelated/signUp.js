import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  Picker,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Platform,
  Modal
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "../contextApi";
import { Actions } from "react-native-router-flux";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP
} from "react-native-responsive-screen";
import NetInfo from "@react-native-community/netinfo";
import { TermsPrivacy } from "../termsPrivacy";
import { apiUrl } from "../config";
import IOSPicker from "react-native-ios-picker";
import NavBar from "../navBar";

let unsubscribe, unsubscribe1;
const strongRegex = new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$");

const emailRegX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const continentArr = [
  "Asia",
  "Antarctica",
  "Africa",
  "Europe",
  "North America",
  "Oceania",
  "South America"
];
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animatedLoading = new Animated.Value(0);
    this.myInt;
  }
  state = {
    secureTextEntry: true,
    legalName: null,
    initiatedName: "",
    phoneNumber: "+91",
    address: null,
    continent: "Asia",
    country: "",
    panNumber: "",
    email: null,
    password: null,
    loading: false,
    referralCode: null,
    emailValidation: true,
    passwordValidation: true,
    mainArray: null,
    countryId: "",
    keyboardViewHeight: 0,
    termsVisible: false,
    agreeCheck: false,
    sendInBlueCountry: null
  };
  componentDidMount() {
    this.getSendInBlueCountry();
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 2
    }).start();
    unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.getContinentCountry();
      } else {
        alert("Network error");
      }
    });
  }
  componentWillUnmount() {
    unsubscribe();
    //this.netListenerSignUp();
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
      this.animatedLoading.setValue(0);
    }
  };

  getSendInBlueCountry = () => {
    fetch(`${apiUrl}verify/phone/send-in-blue-countries`)
      .then(res => res.json())
      .then(sendInBlueCountry => this.setState({ sendInBlueCountry }))
      .catch(e => {
        console.log(e);
        Toast.show("Something went wrong", Toast.LONG);
      });
  };

  getContinentCountry = () => {
    fetch(`${apiUrl}data/countries`)
      .then(res => res.json())
      .then(resJson => {
        let obj = {};
        for (i = 0; i < continentArr.length; i++) {
          resJson[continentArr[i]].sort((a, b) => {
            if (a["countryName"] > b["countryName"]) {
              return 1;
            } else {
              return -1;
            }
          });
          obj[continentArr[i]] = resJson[continentArr[i]];
        }
        //let mainArray = resJson;
        console.log(obj);
        this.setState({
          mainArray: obj,
          country: obj[this.state.continent][0]["countryName"],
          phoneNumber: "+" + obj[this.state.continent][0]["phoneCode"],
          countryId: obj[this.state.continent][0]["countryID"]
        });
      })
      .catch(error => console.log(error));
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
    console.log(this.state.country);

    return (
      <ContextConsumer>
        {value => (
          <LinearGradient
            style={{ flex: 1, justifyContent: "center" }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["rgb(0,193,156)", "rgb(34,110,173)"]}
          >
            <Modal //...............terms&Condition
              visible={this.state.termsVisible}
              transparent={true}
              onRequestClose={() => {
                this.setState({ termsVisible: false });
              }}
            >
              <View
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)"
                }}
                //onPress={() => this.setState({ termsVisible: false })}
              >
                <View
                  //onStartShouldSetResponder={() => true}
                  style={{
                    backgroundColor: "white",
                    width: "90%",
                    height: screenHeight - 120,
                    borderRadius: 10,
                    zIndex: 2
                  }}
                >
                  <TermsPrivacy
                    closeModal={() => this.setState({ termsVisible: false })}
                  />
                </View>
              </View>
            </Modal>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View //.........................................v1
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1.5,
                  flexDirection: "row",
                  paddingLeft: 18
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-start",
                    justifyContent: "flex-end"
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
                  <Text style={styles.txt1}>{I18n.t("newUser")}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end"
                  }}
                >
                  <Image
                    source={require("../../src/logo.png")}
                    style={{
                      width: "80%",
                      height: "100%"
                    }}
                  />
                </View>
              </View>
              {/* <View style={{ width: "100%", screenHeight: screenHeight }}> */}
              <View style={styles.v2}>
                <View
                  style={{
                    width: "100%",
                    height: widthPercentageToDP("4.5%"),
                    flexDirection: "row"
                  }}
                >
                  <Text style={styles.txt1}>{I18n.t("legalName")}</Text>
                  <Text
                    style={[
                      styles.txt1,
                      {
                        color: "#D2553E",
                        fontSize: widthPercentageToDP("3.5%")
                      }
                    ]}
                  >
                    *
                  </Text>
                </View>
                <TextInput
                  style={styles.txtInput}
                  ref={input => (this.txtinput1 = input)}
                  // onEndEditing={() => {
                  //   this.txtinput2.focus();
                  // }}
                  value={this.state.legalName}
                  onChangeText={txt => this.setState({ legalName: txt })}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.v2}>
                <Text style={styles.txt1}>{I18n.t("initiatedName")}</Text>
                <TextInput
                  style={styles.txtInput}
                  ref={input => (this.txtinput2 = input)}
                  // onEndEditing={() => {
                  //   this.txtinput3.focus();
                  // }}
                  value={this.state.initiatedName}
                  onChangeText={txt => this.setState({ initiatedName: txt })}
                  autoCapitalize="words"
                />
              </View>
              <View //.......................................picker
                style={{
                  width: "95%",
                  height: hp("8.5%"),
                  flexDirection: "row",
                  margin: 10,
                  justifyContent: "space-between"
                }}
              >
                <View //...................................continent
                  style={styles.v3}
                >
                  <Text style={styles.txt1}>{I18n.t("continent")}</Text>
                  {Platform.OS === "android" ? (
                    <Picker
                      selectedValue={this.state.continent}
                      style={{
                        width: "100%",
                        height: "70%",
                        paddingBottom: 6,
                        color: "#fff"
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          continent: itemValue
                        });
                      }}
                    >
                      {continentArr.map((item, index) => (
                        <Picker.Item
                          key={index.toString()}
                          label={item}
                          value={item}
                        />
                      ))}
                    </Picker>
                  ) : (
                    <IOSPicker
                      mode="modal"
                      selectedValue={this.state.continent}
                      style={{
                        width: "100%",
                        height: "70%",
                        paddingBottom: 6,
                        backgroundColor: "rgba(0,0,0,0)"
                      }}
                      textStyle={{ color: "#fff" }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          continent: itemValue,
                          country: this.state.mainArray[itemValue][0][
                            "countryName"
                          ],
                          phoneNumber:
                            "+" +
                            this.state.mainArray[itemValue][0]["phoneCode"]
                        });
                      }}
                    >
                      {continentArr.map((item, index) => (
                        <Picker.Item
                          key={index.toString()}
                          label={item}
                          value={item}
                        />
                      ))}
                    </IOSPicker>
                  )}
                </View>

                <View //...................................country
                  style={styles.v3}
                >
                  <Text style={styles.txt1}>{I18n.t("country")}</Text>
                  {Platform.OS === "android" ? (
                    <Picker
                      selectedValue={this.state.country}
                      style={{
                        width: "100%",
                        height: "80%",
                        paddingBottom: 6,
                        color: "#fff"
                      }}
                      onValueChange={(item, itemIndex) => {
                        for (
                          i = 0;
                          i < this.state.mainArray[this.state.continent].length;
                          i++
                        ) {
                          if (
                            this.state.mainArray[this.state.continent][i][
                              "countryName"
                            ] == item
                          ) {
                            this.setState({
                              country: item,
                              phoneNumber:
                                "+" +
                                this.state.mainArray[this.state.continent][i][
                                  "phoneCode"
                                ],
                              countryId: this.state.mainArray[
                                this.state.continent
                              ][i]["countryID"]
                            });
                            break;
                          }
                        }
                      }}
                    >
                      {this.state.mainArray
                        ? this.state.mainArray[
                            this.state.continent
                          ].map((item, index) => (
                            <Picker.Item
                              key={index.toString()}
                              label={item.countryName}
                              value={item.countryName}
                            />
                          ))
                        : null}
                    </Picker>
                  ) : (
                    <IOSPicker
                      mode="modal"
                      selectedValue={this.state.country}
                      style={{
                        width: "100%",
                        height: "80%",
                        paddingBottom: 6,
                        backgroundColor: "rgba(0,0,0,0)"
                      }}
                      textStyle={{ color: "#fff" }}
                      onValueChange={(item, itemIndex) => {
                        for (
                          i = 0;
                          i < this.state.mainArray[this.state.continent].length;
                          i++
                        ) {
                          if (
                            this.state.mainArray[this.state.continent][i][
                              "countryName"
                            ] == item
                          ) {
                            this.setState({
                              country: item,
                              phoneNumber:
                                "+" +
                                this.state.mainArray[this.state.continent][i][
                                  "phoneCode"
                                ],
                              countryId: this.state.mainArray[
                                this.state.continent
                              ][i]["countryID"]
                            });
                            break;
                          }
                        }
                      }}
                    >
                      {this.state.mainArray
                        ? this.state.mainArray[
                            this.state.continent
                          ].map((item, index) => (
                            <Picker.Item
                              key={index.toString()}
                              label={item.countryName}
                              value={item.countryName}
                            />
                          ))
                        : null}
                    </IOSPicker>
                  )}
                </View>
              </View>

              <View //...............email
                style={[
                  styles.v2,
                  {
                    borderBottomColor: this.state.emailValidation
                      ? "#42aec2"
                      : "rgb(255,76,67)"
                  }
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    height: widthPercentageToDP("4.5%"),
                    flexDirection: "row"
                  }}
                >
                  <Text style={styles.txt1}>{I18n.t("emailId")}</Text>
                  <Text
                    style={[
                      styles.txt1,
                      {
                        color: "#D2553E",
                        fontSize: widthPercentageToDP("3.5%")
                      }
                    ]}
                  >
                    *
                  </Text>
                </View>
                <TextInput
                  style={styles.txtInput}
                  value={this.state.email}
                  keyboardType="email-address"
                  ref={input => (this.txtinput5 = input)}
                  onChangeText={txt => {
                    this.setState({ email: txt });
                  }}
                  onEndEditing={e => {
                    this.setState({
                      emailValidation: emailRegX.test(e.nativeEvent.text)
                    });
                    // if (emailRegX.test(e.nativeEvent.text)) {
                    //   this.txtinput6.focus();
                    // }
                  }}
                />
              </View>
              <View //...............phone
                style={[
                  styles.v2,
                  {
                    borderBottomColor: "#42aec2"
                    // this.state.emailValidation
                    //   ? "#42aec2"
                    //   : "rgb(255,76,67)"
                  }
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    height: widthPercentageToDP("4.5%"),
                    flexDirection: "row"
                  }}
                >
                  <Text style={styles.txt1}>{I18n.t("phoneNumber")}</Text>
                  <Text
                    style={[
                      styles.txt1,
                      {
                        color: "#D2553E",
                        fontSize: widthPercentageToDP("3.5%")
                      }
                    ]}
                  >
                    *
                  </Text>
                </View>
                <TextInput
                  style={styles.txtInput}
                  value={this.state.phoneNumber}
                  keyboardType="phone-pad"
                  ref={input => (this.txtinput6 = input)}
                  // onEndEditing={e => {
                  //   this.txtinput7.focus();
                  // }}
                  onChangeText={txt => {
                    this.setState({ phoneNumber: txt });
                  }}
                />
              </View>
              <View //............password
                style={[
                  styles.v2,
                  {
                    borderBottomColor: this.state.passwordValidation
                      ? "#42aec2"
                      : "rgb(255,76,67)"
                  }
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    height: widthPercentageToDP("4.5%"),
                    flexDirection: "row"
                  }}
                >
                  <Text style={styles.txt1}>{I18n.t("password")}</Text>
                  <Text
                    style={[
                      styles.txt1,
                      {
                        color: "#D2553E",
                        fontSize: widthPercentageToDP("3.5%")
                      }
                    ]}
                  >
                    *
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: "80%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <TextInput
                    style={[styles.txtInput, { width: "90%", height: "100%" }]}
                    ref={value => (this.txtinput7 = value)}
                    secureTextEntry={this.state.secureTextEntry}
                    value={this.state.password}
                    //placeholder="Minimum eight characters required"
                    //placeholderTextColor="#fff"
                    onChangeText={txt => this.setState({ password: txt })}
                    onEndEditing={e => {
                      if (e.nativeEvent.text.length < 8) {
                        Toast.showWithGravity(
                          "Minimum eight characters required",
                          Toast.LONG,
                          Toast.BOTTOM
                        );
                        this.setState({
                          passwordValidation: false
                        });
                      } else {
                        this.setState({
                          passwordValidation: true
                        });
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}
                    onPress={() => {
                      this.setState({
                        secureTextEntry: !this.state.secureTextEntry
                      });
                    }}
                  >
                    <Icon
                      name={this.state.secureTextEntry ? "eye-off" : "eye"}
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
              <View //......terms
                style={{
                  flexDirection: "row",
                  paddngRight: 10,
                  width: "100%",
                  height: 40,
                  paddingLeft: 18,
                  paddingTop: 8,
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      agreeCheck: !this.state.agreeCheck
                    });
                  }}
                  style={[
                    styles.radioBtnV1,
                    {
                      backgroundColor: this.state.agreeCheck
                        ? "#fff"
                        : "rgba(0,0,0,0.1)",
                      borderColor: "#42aec2"
                    }
                  ]}
                >
                  <Icon
                    name={this.state.agreeCheck ? "check" : null}
                    size={16}
                    color="black"
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.txt1,
                    { textAlign: "left", fontSize: widthPercentageToDP("3.1%") }
                  ]}
                >
                  {I18n.t("logInTerms")}{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ termsVisible: true });
                  }}
                  style={{ borderBottomWidth: 1.5, borderBottomColor: "#fff" }}
                >
                  <Text
                    style={[
                      styles.txt1,
                      {
                        textAlign: "left",
                        fontSize: widthPercentageToDP("3.1%")
                      }
                    ]}
                  >
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.txt1,
                    { textAlign: "left", fontSize: widthPercentageToDP("3.1%") }
                  ]}
                >
                  {" "}
                  {I18n.t("apply")}
                </Text>
              </View>
              <View //....................................btn
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1,
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
                      style={{ color: "#fff", fontSize: 18, paddingLeft: 10 }}
                    >
                      Signing Up
                    </Text>
                  </View>
                ) : (
                  <AnimatedBtn
                    onPress={() => {
                      unsubscribe1 = NetInfo.addEventListener(state => {
                        if (state.isConnected) {
                          //alert(this.state.panNumberValidation);
                          if (
                            this.state.legalName &&
                            this.state.continent &&
                            this.state.country &&
                            this.state.email &&
                            this.state.password &&
                            this.state.emailValidation &&
                            this.state.phoneNumber &&
                            this.state.agreeCheck
                          ) {
                            this.setState({ loading: true });
                            this.loadingController(true);
                            if (this.state.country == "India") {
                              fetch(`${apiUrl}verify/phone`, {
                                method: "POST",
                                headers: {
                                  authorization:
                                    "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                  Accept: "application/json",
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  email: this.state.email.toLowerCase(),
                                  phone: this.state.phoneNumber,
                                  password: this.state.password,
                                  legalName: this.state.legalName,
                                  initiatedName: this.state.initiatedName,
                                  address: "",
                                  country: this.state.country,
                                  continent: this.state.continent,
                                  panNo: this.state.panNumber
                                })
                              })
                                .then(response => {
                                  const statusCode = response.status;
                                  const data = response.json();
                                  return Promise.all([statusCode, data]);
                                })
                                .then(([status, data]) => {
                                  this.loadingController(false);
                                  this.setState({ loading: false });
                                  if (status == 400 || status == 403) {
                                    this.setState({ loading: false });
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 404) {
                                    this.setState({ loading: false });
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 500) {
                                    this.setState({ loading: false });
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 200) {
                                    Actions.replace("verifyPhone", {
                                      data,
                                      email: this.state.email.toLowerCase(),
                                      phone: this.state.phoneNumber,
                                      password: this.state.password,
                                      legalName: this.state.legalName,
                                      initiatedName: this.state.initiatedName,
                                      address: "",
                                      country: this.state.country,
                                      continent: this.state.continent,
                                      panNo: this.state.panNumber,
                                      referralCode: this.props.referralCode,
                                      countryId: this.state.countryId
                                    });
                                  }
                                })
                                .catch(error => {
                                  Toast.show(error, Toast.LONG);
                                });
                            } //..............................................onOtherCountry
                            else {
                              fetch(`${apiUrl}verify/email`, {
                                method: "POST",
                                headers: {
                                  authorization:
                                    "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                  Accept: "application/json",
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  email: this.state.email.toLowerCase(),
                                  phone: this.state.phoneNumber,
                                  password: this.state.password,
                                  legalName: this.state.legalName,
                                  initiatedName: this.state.initiatedName,
                                  address: "",
                                  country: this.state.country,
                                  continent: this.state.continent,
                                  panNo: this.state.panNumber
                                })
                              })
                                .then(response => {
                                  const statusCode = response.status;
                                  const data = response.json();
                                  return Promise.all([statusCode, data]);
                                })
                                .then(([status, data]) => {
                                  console.log(data, status);
                                  this.loadingController(false);
                                  this.setState({ loading: false });
                                  if (status == 400 || status == 403) {
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 404) {
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 500) {
                                    Toast.show(data.message, Toast.LONG);
                                  } else if (status == 200) {
                                    Actions.push("verifyEmail", {
                                      data,
                                      email: this.state.email.toLowerCase(),
                                      phone: this.state.phoneNumber,
                                      password: this.state.password,
                                      legalName: this.state.legalName,
                                      initiatedName: this.state.initiatedName,
                                      address: "",
                                      country: this.state.country,
                                      continent: this.state.continent,
                                      panNo: this.state.panNumber,
                                      referralCode: this.props.referralCode,
                                      countryId: this.state.countryId
                                    });
                                  }
                                })
                                .catch(error => {
                                  Toast.show(error, Toast.LONG);
                                });
                            }
                          } else if (!this.state.agreeCheck) {
                            Toast.show(
                              "Agree Terms & Conditions to proceed",
                              Toast.LONG
                            );
                            this.setState({ loading: false });
                          } else {
                            Toast.show("Please check your Inputs", Toast.LONG);
                            this.setState({ loading: false });
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
                        top: 0,
                        backgroundColor: animatedBorderColor
                      }
                    ]}
                    disabled={this.state.loading}
                  >
                    <Text style={styles.btnTxt}>{I18n.t("signUp")}</Text>
                  </AnimatedBtn>
                )}
              </View>
              <View
                style={{ width: "100%", height: this.state.keyboardViewHeight }}
              />
            </ScrollView>
          </LinearGradient>
        )}
      </ContextConsumer>
    );
  }
}
const styles = StyleSheet.create({
  txt1: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.2%"),
    color: "#fff"
  },
  v2: {
    backgroundColor: "rgba(0,0,0,0.52)",
    width: "95%",
    height: hp("8.5%"),
    margin: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingLeft: 18,
    paddingTop: 8,
    borderBottomColor: "#42aec2",
    borderBottomWidth: 2.5
  },
  v3: {
    backgroundColor: "rgba(0,0,0,0.52)",
    height: "100%",
    width: "48%",
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
    fontSize: widthPercentageToDP("3.3%"),
    paddingBottom: 6,
    fontFamily: "Montserrat-SemiBold"
  },
  btnV: {
    marginTop: 18,
    width: 180,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#42aec2",
    justifyContent: "center",
    alignItems: "center"
  },
  btnTxt: {
    fontSize: widthPercentageToDP("3.4%"),
    color: "#fff",
    textTransform: "capitalize",
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
  }
});
