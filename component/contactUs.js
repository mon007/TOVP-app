import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar
} from "react-native";
import NavBar from "./navBar";
import {
  heightPercentageToDP,
  widthPercentageToDP
} from "react-native-responsive-screen";
import I18n from "react-native-i18n";
import { apiUrl } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { ContextConsumer } from "./contextApi";

const emailRegX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let userId;
export default class ContactUs extends React.Component {
  state = {
    radioButton: false,
    name: "",
    email: "",
    subject: "",
    message: "",
    emailValidation: true,
    fetching: false
  };

  componentDidMount() {
    if (this.props.id) {
      this.setState({ subject: this.props.id });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          ></View>
        ) : null}
        {Platform.OS === "ios" ? (
          <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        ) : null}
        <NavBar
          title={I18n.t("contactUs")}
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        {this.state.fetching ? (
          <ActivityIndicator
            value={this.state.fetching}
            color="#42aec2"
            size={Platform.OS === "android" ? 20 : 1}
          />
        ) : null}
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              width: "90%",
              height:
                Dimensions.get("window").height + heightPercentageToDP("10%"),
              backgroundColor: "#fff",
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 18,
              elevation: 10
            }}
          >
            <View //................title
              style={{
                width: "100%",
                height: 40,
                justifyContent: "center",
                paddingLeft: 18
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.5%"),
                  color: "#454545"
                }}
              >
                {I18n.t("sendUsAMessage")}
              </Text>
            </View>

            <View style={styles.v1}>
              <Text style={styles.txt}>{I18n.t("contactUsName")}</Text>
              <TextInput
                style={styles.txtInput}
                value={this.state.name}
                onChangeText={txt => this.setState({ name: txt })}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.v1}>
              <Text style={styles.txt}>{I18n.t("contactUsEmail")}</Text>
              <TextInput
                style={[
                  styles.txtInput,
                  {
                    borderBottomColor: this.state.emailValidation
                      ? "#454545"
                      : "red"
                  }
                ]}
                value={this.state.email}
                onChangeText={txt =>
                  this.setState({ email: txt.toLowerCase() })
                }
                onEndEditing={e => {
                  this.setState({
                    emailValidation: emailRegX.test(e.nativeEvent.text)
                  });
                }}
              />
            </View>
            <View style={styles.v1}>
              <Text style={styles.txt}>{I18n.t("contactUsSubject")}</Text>
              <TextInput
                style={styles.txtInput}
                value={this.state.subject}
                onChangeText={txt => this.setState({ subject: txt })}
              />
            </View>
            <View style={styles.v1}>
              <Text style={styles.txt}>{I18n.t("contactUsMessage")}</Text>
              <TextInput
                style={styles.txtInput}
                value={this.state.message}
                onChangeText={txt => this.setState({ message: txt })}
              />
            </View>

            <View //........................radio
              style={{
                width: "100%",
                height: 70,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 18
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    radioButton: !this.state.radioButton
                  });
                }}
                style={{
                  height: 15,
                  width: 15,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: this.state.radioButton ? "#42aec2" : "grey",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10
                }}
              >
                {this.state.radioButton ? (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 10,
                      backgroundColor: "#42aec2"
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    color: "#454545",
                    fontSize: widthPercentageToDP("3.2%")
                  }}
                >
                  {I18n.t("contactUsRadio")}
                </Text>
              </View>
            </View>
            <View //......................submit
              style={{
                width: "100%",
                aspectRatio: 5 / 2,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ fetching: true });
                  let url = `${apiUrl}contact`;
                  fetch(url, {
                    method: "POST",
                    headers: {
                      authorization:
                        "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      name: this.state.name,
                      email: this.state.email,
                      subject: this.state.subject,
                      message: this.state.message
                    })
                  })
                    .then(res => res.json())
                    .then(resJson => {
                      if (resJson) {
                        alert(resJson.message);
                        this.setState({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                          fetching: false
                        });
                      }
                    })
                    .catch(e => alert(e));
                }}
                style={{
                  width: 120,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  elevation: 10,
                  backgroundColor:
                    this.state.emailValidation &&
                    this.state.radioButton &&
                    this.state.email != "" &&
                    this.state.name != "" &&
                    this.state.subject != "" &&
                    this.state.message != ""
                      ? "#42aec2"
                      : "#dfdfdf",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1
                }}
                disabled={
                  !(
                    this.state.emailValidation &&
                    this.state.radioButton &&
                    this.state.email != "" &&
                    this.state.name != "" &&
                    this.state.subject != "" &&
                    this.state.message != ""
                  )
                }
              >
                <Text
                  style={{
                    color:
                      this.state.emailValidation &&
                      this.state.radioButton &&
                      this.state.email != "" &&
                      this.state.name != "" &&
                      this.state.subject != "" &&
                      this.state.message != ""
                        ? "#deffffff"
                        : "#9f9f9f",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 15
                  }}
                >
                  {I18n.t("contactUsSubmit")}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "90%",
                height: 0.5,
                backgroundColor: "grey",
                alignSelf: "center"
              }}
            />
            <View
              style={{
                width: "90%",
                aspectRatio: 5 / 1,
                alignSelf: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.5%"),
                  fontFamily: "Montserrat-SemiBold",
                  color: "#454545"
                }}
              >
                {I18n.t("contactUsGetInTouch")}
              </Text>
              <View
                style={{
                  width: "12%",
                  height: 10,
                  alignSelf: "flex-start",
                  borderBottomColor: "#42aec2",
                  borderBottomWidth: 2
                }}
              />
            </View>
            <View
              style={{
                width: "100%",
                aspectRatio: 5 / 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: 20
              }}
            >
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                {I18n.t("contactUsPh")}: +91 (3472) 245214
              </Text>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                {I18n.t("contactUsFax")}: +91 (3472) 245238
              </Text>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                {I18n.t("contactUsEmail")}: info@tovp.org
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                aspectRatio: 5 / 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: 20
              }}
            >
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                ISKCON Mayapur
              </Text>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Chakra Building, Room 204
              </Text>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Dist. Nadia, West Bengal India, 741313
              </Text>
            </View>
            <View style={{ width: "100%", height: 10 }} />
          </View>
          <View style={{ width: "100%", height: 10 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  v1: {
    width: "100%",
    height: heightPercentageToDP("10%"),
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    paddingLeft: 18,
    paddingTop: 10
  },
  txt: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.3%"),
    color: "#454545"
  },
  txtInput: {
    width: "90%",
    height: 40,
    borderBottomWidth: 1,
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.5%"),
    color: "#454545"
  }
});
