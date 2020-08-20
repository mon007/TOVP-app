import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/dist/Feather";
import { primaryColor, apiUrl } from "./config";
import Toast from "react-native-simple-toast";
import { sha256 } from "react-native-sha256";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

const emailRegX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const screenWidth = Dimensions.get("window").width;

export default class ProfileUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.animatedView = new Animated.Value(0);
  }

  state = {
    txtInput: "",
    otp: "",
    password: "",
    txtInputValid: true,
    secureTextEntry: true,
    phoneCode: "",
    fetching: false,
    errorMessage: "",
    errorMessageFlag: false,
  };

  componentDidMount() {
    Animated.spring(this.animatedView, {
      toValue: 1,
      tension: 10,
      useNativeDriver: true,
    }).start();
    if (this.props.modalData == "phone") {
      this.getContinentCountry();
    }
  }

  getContinentCountry = () => {
    fetch(`${apiUrl}data/countries`)
      .then((res) => res.json())
      .then((resJson) => {
        let continentArr = resJson[this.props.continent].sort((a, b) => {
          if (a["countryName"] > b["countryName"]) {
            return 1;
          } else {
            return -1;
          }
        });
        for (let i = 0; i < continentArr.length; i++) {
          if (continentArr[i]["countryName"] == this.props.country) {
            this.setState({
              phoneCode: "+" + continentArr[i]["phoneCode"],
            });
            break;
          }
        }
      })
      .catch((error) => console.log(error));
  };

  //on Text Input change text
  onChangeText = (value) => {
    this.setState({
      txtInput: value,
      errorMessageFlag: false,
      errorMessage: "",
    });
  };

  onEndEditing = (e) => {
    if (this.props.modalData == "email") {
      this.setState({
        txtInputValid: emailRegX.test(e.nativeEvent.text),
      });
    } else if (this.props.modalData == "phone") {
      this.setState({
        txtInputValid: e.nativeEvent.text.length == 10,
      });
    }
  };

  //on Update btn pressed
  onUpdate = () => {
    this.setState({ fetching: true });
    if (this.props.modalData == "phone" && this.props.country != "India") {
      this.onOtp();
    } else {
      let url = `${apiUrl}user/profile/${this.props.modalData}/otp`;
      sha256(this.state.password).then((hash) => {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: hash,
            userId: this.props.userId,
            email: this.state.txtInput.toLowerCase(),
            phone: `${this.state.phoneCode}${this.state.txtInput}`,
          }),
        })
          .then((res) => {
            let data = res.json();
            let status = res.status;
            return Promise.all([data, status]);
          })
          .then(([data, status]) => {
            console.log("email/ph", data, status);
            if (status == 200) {
              this.setState({ fetching: false });
              this.handleAnimation();
            } else {
              this.setState({
                fetching: false,
                errorMessageFlag: true,
                errorMessage: data.message,
              });
            }
          })
          .catch((e) => {
            console.log(e);
            this.setState({ fetching: false });
          });
      });
    }
  };

  //handle animation
  handleAnimation = () => {
    Animated.spring(this.animatedView, {
      toValue: 2,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  //check otp
  onOtp = () => {
    this.setState({ fetching: true });
    sha256(this.state.password).then((hash) => {
      console.log(`${apiUrl}user/profile/${this.props.modalData}`, {
        userId: this.props.userId,
        otp: Number(this.state.otp),
        country: this.props.country,
        phone: `${this.state.phoneCode}${this.state.txtInput}`,
        email: this.state.txtInput.toLowerCase(),
        password: hash,
      });
      fetch(`${apiUrl}user/profile/${this.props.modalData}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.props.userId,
          otp: Number(this.state.otp),
          country: this.props.country,
          phone: `${this.state.phoneCode}${this.state.txtInput}`,
          email: this.state.txtInput.toLowerCase(),
          password: hash,
        }),
      })
        .then((res) => {
          let data = res.json();
          let status = res.status;
          return Promise.all([data, status]);
        })
        .then(([data, status]) => {
          console.log(data, status);
          if (status == 200) {
            if (this.props.modalData == "phone") {
              Toast.show("Phone Number Updated Successfully", Toast.LONG);
            } else {
              Toast.show("Email Address Updated Successfully", Toast.LONG);
            }
            this.setState({ fetching: false });
            this.props.getProfileInfo();
            this.props.hideModal();
          } else {
            this.setState({
              fetching: false,
              errorMessageFlag: true,
              errorMessage: data.message,
            });
            //Toast.show(data.message, Toast.LONG);
          }
        })
        .catch((e) => {
          console.log(e);
          this.setState({ fetching: false });
        });
    });
  };

  render() {
    const view1 = this.animatedView.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [2 * screenWidth, 0, -screenWidth],
    });
    const view1Rotate = this.animatedView.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ["90deg", "0deg", "0deg"],
    });
    const view2 = this.animatedView.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [2 * screenWidth, screenWidth, 0],
    });
    const view2Rotate = this.animatedView.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ["90deg", "90deg", "0deg"],
    });
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View //email phone
          style={{
            transform: [
              { rotate: view1Rotate },
              { translateX: view1 },
              { translateY: heightPercentageToDP(25) },
            ],
            width: widthPercentageToDP(95),
            height: heightPercentageToDP(50),
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: primaryColor,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            borderRadius: widthPercentageToDP(3),
          }}
        >
          <TouchableOpacity //crossX
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              right: 1,
              top: 1,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3,
            }}
            onPress={() => {
              this.props.hideModal();
            }}
          >
            <View
              style={{
                width: widthPercentageToDP(5.5),
                height: widthPercentageToDP(5.5),
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#42aec2", //"rgb(255,65,60)"
              }}
            >
              <Icon name="x" color="#fff" size={14} />
            </View>
          </TouchableOpacity>
          <View // email/phone field
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingBottom: widthPercentageToDP(3),
            }}
          >
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                padding: widthPercentageToDP(2),
              }}
            >
              <Text
                style={{
                  color: "#454545",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP(3.5),
                }}
              >
                {this.props.modalData == "phone"
                  ? "Phone Number :"
                  : "Email address :"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgb(208,208,208)",
                width: "90%",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: this.state.txtInputValid
                  ? "rgb(208,208,208)"
                  : "red",
                height: heightPercentageToDP(8),
                alignSelf: "center",
                flexDirection: "row",
                paddingLeft: 10,
              }}
            >
              {this.props.modalData == "phone" && this.state.txtInput ? (
                <View
                  style={{
                    height: "100%",
                    width: "10%",
                    //backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      color: "#454545",
                      fontSize: widthPercentageToDP(3.5),
                    }}
                  >
                    {this.state.phoneCode}
                  </Text>
                </View>
              ) : null}
              <TextInput
                style={{
                  width: "92%",
                  height: "100%",
                  color: "#454545",
                  fontSize: widthPercentageToDP(3.5),
                  //paddingLeft: widthPercentageToDP(2),
                }}
                placeholder={
                  this.props.modalData == "email"
                    ? `Your new email-address here`
                    : `Your new phone number here`
                }
                placeholderTextColor="#454545"
                value={this.state.txtInput}
                onChangeText={this.onChangeText}
                onEndEditing={this.onEndEditing}
                keyboardType={
                  this.props.modalData == "email"
                    ? "email-address"
                    : "phone-pad"
                }
              />
            </View>
          </View>
          <View // password field
            style={{
              flex: 1,
              justifyContent: "center",
              //paddingBottom: widthPercentageToDP(3),
            }}
          >
            <View
              style={{
                backgroundColor: "rgb(208,208,208)",
                width: "90%",
                borderRadius: 8,
                height: heightPercentageToDP(8),
                alignSelf: "center",
                flexDirection: "row",
                paddingLeft: 10,
              }}
            >
              <TextInput
                style={{
                  width: "92%",
                  height: "100%",
                  color: "#454545",
                  fontSize: widthPercentageToDP(3.5),
                  //paddingLeft: widthPercentageToDP(2),
                }}
                placeholder="Mention your existing password"
                placeholderTextColor="#454545"
                value={this.state.password}
                secureTextEntry={this.state.secureTextEntry}
                onChangeText={(password) =>
                  this.setState({
                    password,
                    errorMessageFlag: false,
                    errorMessage: "",
                  })
                }
              />
              <TouchableOpacity
                style={{
                  width: 40,
                  height: "100%",
                  position: "absolute",
                  right: 8,
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
                  name={this.state.secureTextEntry ? "eye-off" : "eye"}
                  size={widthPercentageToDP(3.8)}
                  color="#454545"
                />
              </TouchableOpacity>
            </View>
            {this.state.errorMessageFlag ? (
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  paddingTop: widthPercentageToDP(2),
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "#d2553e",
                    paddingLeft: widthPercentageToDP(1),
                    fontSize: widthPercentageToDP(3.3),
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  -- {this.state.errorMessage}
                </Text>
              </View>
            ) : null}
          </View>
          <View //..................................touchablebtn
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.state.fetching ? (
              <View
                style={{
                  width: widthPercentageToDP(30),
                  height: widthPercentageToDP(20),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <UIActivityIndicator
                  color={primaryColor}
                  size={widthPercentageToDP(6)}
                  waveMode="outline"
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={this.onUpdate}
                style={{
                  width: "60%",
                  height: heightPercentageToDP(6),
                  backgroundColor:
                    this.state.txtInput &&
                    this.state.password &&
                    this.state.txtInputValid &&
                    !this.state.errorMessageFlag
                      ? "#42aec2"
                      : "rgb(245,245,245)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  elevation: 15,
                }}
                disabled={
                  !(
                    this.state.txtInput &&
                    this.state.password &&
                    this.state.txtInputValid &&
                    !this.state.errorMessageFlag
                  )
                }
              >
                <Text
                  style={{
                    color:
                      this.state.txtInput &&
                      this.state.password &&
                      this.state.txtInputValid &&
                      !this.state.errorMessageFlag
                        ? "#deffffff"
                        : "#9f9f9f",
                    fontSize: 18,
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  {this.props.modalData == "phone" &&
                  this.props.country != "India"
                    ? "Update"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View //otp
          style={{
            // position:"relative",
            // right: -widthPercentageToDP(100),
            // bottom: heightPercentageToDP(25),
            transform: [
              { rotate: view2Rotate },
              { translateX: view2 },
              { translateY: -heightPercentageToDP(25) },
            ],
            width: widthPercentageToDP(95),
            height: heightPercentageToDP(50),
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: primaryColor,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            borderRadius: widthPercentageToDP(3),
          }}
        >
          <TouchableOpacity //crossX
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              right: 1,
              top: 1,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3,
            }}
            onPress={() => {
              this.props.hideModal();
            }}
          >
            <View
              style={{
                width: widthPercentageToDP(5.5),
                height: widthPercentageToDP(5.5),
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#42aec2", //"rgb(255,65,60)"
              }}
            >
              <Icon name="x" color="#fff" size={14} />
            </View>
          </TouchableOpacity>
          <View // otp field
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingBottom: widthPercentageToDP(3),
            }}
          >
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                padding: widthPercentageToDP(2),
              }}
            >
              <Text
                style={{
                  color: "#454545",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP(3.5),
                }}
              >
                Enter the OTP :
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "rgb(208,208,208)",
                width: "90%",
                borderRadius: 8,
                height: heightPercentageToDP(8),
                alignSelf: "center",
              }}
            >
              <TextInput
                style={{
                  width: "92%",
                  height: "100%",
                  color: "#454545",
                  //backgroundColor: "red",
                  alignSelf: "center",
                }}
                placeholder="Enter OTP"
                placeholderTextColor="#454545"
                value={this.state.otp}
                onChangeText={(otp) =>
                  this.setState({
                    otp,
                    errorMessageFlag: false,
                    errorMessage: "",
                  })
                }
              />
            </View>
            {this.state.fetching ? null : (
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  alignItems: "flex-end",
                  paddingRight: widthPercentageToDP(1),
                  paddingTop: widthPercentageToDP(2),
                }}
              >
                <TouchableOpacity onPress={this.onUpdate}>
                  <Text
                    style={{
                      color: "#d2553e",
                      paddingLeft: widthPercentageToDP(1),
                      fontSize: widthPercentageToDP(3.3),
                      fontFamily: "Montserrat-Regular",
                      textDecorationLine: "underline",
                    }}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {this.state.errorMessageFlag ? (
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  paddingTop: widthPercentageToDP(2),
                }}
              >
                <Text
                  style={{
                    color: "#d2553e",
                    paddingLeft: widthPercentageToDP(1),
                    fontSize: widthPercentageToDP(3.3),
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  -- {this.state.errorMessage}
                </Text>
              </View>
            ) : null}
          </View>
          <View //..................................touchablebtn
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.state.fetching ? (
              <View
                style={{
                  width: widthPercentageToDP(30),
                  height: widthPercentageToDP(20),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <UIActivityIndicator
                  color={primaryColor}
                  size={widthPercentageToDP(6)}
                  waveMode="outline"
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={this.onOtp}
                style={{
                  width: "60%",
                  height: heightPercentageToDP(6),
                  backgroundColor:
                    this.state.otp && !this.state.errorMessageFlag
                      ? "#42aec2"
                      : "rgb(245,245,245)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  elevation: 15,
                }}
                disabled={!this.state.otp && !this.state.errorMessageFlag}
              >
                <Text
                  style={{
                    color:
                      this.state.otp && !this.state.errorMessageFlag
                        ? "#deffffff"
                        : "#9f9f9f",
                    fontSize: 18,
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  Update
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }
}
