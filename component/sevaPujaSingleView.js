import React from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Picker,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Platform
} from "react-native";
import Toast from "react-native-simple-toast";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import LinearGradient from "react-native-linear-gradient";
import Icon, { ToolbarAndroid } from "react-native-vector-icons/dist/Feather";
import { WebView } from "react-native-webview";
import { TermsPrivacy } from "./termsPrivacy";
import RazorpayCheckout from "react-native-razorpay";
import { getStatusBarHeight } from "react-native-status-bar-height";
import DateTimePicker from "react-native-modal-datetime-picker";

import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import { apiUrl, paypalApiUrl, razorpayKey } from "./config";
import IOSPicker from "react-native-ios-picker";
//import PendingStatus from "./pendingStatus";

const termsList = [
  "You should have sufficient wallet to performing puja.",
  "Puja is subjected to availability of dates and booking.",
  "Ones your puja is performed we will notify you by email for confirmation.",
  "Ones Puja is booked it cannot be cancel or transferred to others name."
];
const occasionArr = [
  "Birthday puja",
  "Anniversary puja",
  "Quick recovery from illness",
  "For good health of Guru Maharaja",
  "Overcome financial issue",
  "General puja",
  "Other"
];
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const LeftPadding = 120 / 2 - (screenWidth - 0.9 * screenWidth) / 2;
let transactionFee;
let prevProductId;

const AnimateBtn = Animated.createAnimatedComponent(TouchableOpacity);

export default class SevaPujaSingleView extends React.Component {
  state = {
    occasion: "Birthday puja",
    pujaPerson: "",
    isDatePickerVisible: false,
    date: moment(new Date())
      .add(1, "day")
      .format("DD.MM.YYYY"),
    viewHeight: screenHeight / 2 + 120,
    comment: "",
    borderColor: "#42aec2",
    modalVisible: false,
    checkTerms: false,
    commentBColor: "#42aec2"
  };

  postBuyNow = () => {
    if (this.state.occasion == "Other" && this.state.comment == "") {
      this.setState({ commentBColor: "red" });
    } else {
      let url = apiUrl + "seva/buy";
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.pujaPerson,
          dateOfPuja: moment(this.state.date, "DD.MM.YYYY").valueOf(),
          occasion:
            this.state.occasion == "Other"
              ? this.state.comment
              : this.state.occasion,
          pujaName: this.props.item.title,
          points: this.props.item.amount,
          dateOfPayment: moment(new Date()).valueOf(),
          userId: this.props.item.userId
        })
      })
        .then(res => {
          let data = res.json();
          let status = res.status;
          return Promise.all([status, data]);
        })
        .then(([status, data]) => {
          if (status == 200) {
            Toast.show(data, Toast.LONG);
            Actions.popTo("shareBhaktiBazzar");
            //this.props.getSevaHistory();
          } else {
            Toast.show(data, Toast.LONG);
          }
        })
        .catch(e => console.log(e));
    }
  };
  render() {
    //console.log("sevaPuja", this.state.borderColor == "#42aec2");
    return (
      <React.Fragment>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
          transparent={true}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View
              style={{
                height: "65%",
                width: "90%",
                alignSelf: "center",
                marginTop: 200,
                backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1.5,
                  //   backgroundColor: "green",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-Bold",
                    fontSize: widthPercentageToDP("3.4%"),
                    textAlign: "center"
                  }}
                >
                  {this.props.item.title}
                </Text>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.15%")
                  }}
                >
                  {this.props.item.amount}
                </Text>
              </View>

              {termsList.map((
                item,
                index //.....................list Map
              ) => (
                <View
                  key={index.toString()}
                  style={{
                    width: "90%",
                    height: 60,
                    alignSelf: "center",
                    // backgroundColor: "red",
                    flexDirection: "row",
                    marginBottom: 10,
                    paddingLeft: 8,
                    paddingRight: 8,
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Image
                    source={require("../src/checked.png")}
                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                  />
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: "#454545",
                      fontFamily: "Montserrat-SemiBold",
                      textAlign: "left",
                      fontSize: widthPercentageToDP("3.1%")
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  alignSelf: "center"
                }}
              />
              {/* <View
                  style={{
                    width: "90%",
                    aspectRatio: 5 / 1,
                    paddingLeft: 8,
                    alignSelf: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ checkTerms: !this.state.checkTerms })
                    }
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 2,
                      overflow: "visible",
                      borderWidth: 1,
                      borderColor: "#42aec2",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {this.state.checkTerms ? (
                      <Icon name="check" size={15} color="#42aec2" />
                    ) : null}
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      fontSize: widthPercentageToDP("3.1%"),
                      color: "#454545",
                      paddingLeft: 10
                    }}
                  >
                    I AGREE TO THE TERMS & CONDITIONS
                  </Text>
                </View> */}
            </View>
          </TouchableOpacity>
        </Modal>
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={date => {
            if (date > new Date()) {
              //this.getSlots(moment(date).format("DD.MM.YYYY"), this.state.flag);
              //   if (this.checkSpecialDays(moment(date).format("DD.MM.YYYY"))) {
              //     this.setState({
              //       date: moment(date).format("DD.MM.YYYY"),
              //       isDatePickerVisible: false,
              //       amount: this.props.arr[this.props.index].specialPrice[
              //         this.state.totalPicker
              //       ].toFixed(2)
              //     });
              //   } else {
              this.setState({
                date: moment(date).format("DD.MM.YYYY"),
                isDatePickerVisible: false,
                borderColor: "#42aec2"
                // amount: Number(
                //   this.state.flagData[this.state.flag][this.state.totalPicker]
                // ).toFixed(2)
              });
              //}
            } else {
              this.setState({
                date: "",
                isDatePickerVisible: false,
                borderColor: "#fd4968"
              });
            }
          }}
          onCancel={() => this.setState({ isDatePickerVisible: false })}
        />
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          >
            <LinearGradient //...........................topContainer
              colors={["#42aec2", "#007e92"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5
              }}
            ></LinearGradient>
          </View>
        ) : null}

        {/* <StatusBar
          backgroundColor={this.state.statusBarColor}
          barStyle="light-content"
        /> */}

        <ScrollView
          style={{
            backgroundColor: "white"
          }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient //...........................topContainer
            colors={["#42aec2", "#007e92"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5
            }}
          >
            <ImageBackground
              source={require("./../src/tovp_bg_10.png")}
              style={{
                width: "100%",
                height: "100%",

                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
              imageStyle={{ resizeMode: "cover" }}
            >
              <NavBar
                title={I18n.t("redeemPoints")}
                noRightBtn={true}
                color="rgba(0,0,0,0.01)"
                titleColor="white"
                back={true}
              />
              <View
                style={{
                  flex: 1,
                  paddingLeft: 20,
                  paddingBottom: 10,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 8,
                    paddingRight: 8
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: widthPercentageToDP("3.5%"),
                      color: "white",
                      fontFamily: "Montserrat-Bold"
                    }}
                  >
                    {this.props.item.title}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: widthPercentageToDP("3.5%"),
                      color: "white",
                      fontFamily: "Montserrat-Bold"
                    }}
                  >
                    {this.props.item.amount} points
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
          <View //.......................v2
            style={{
              width: "90%",
              height: this.state.viewHeight,
              borderRadius: 10,
              alignSelf: "center",
              elevation: 10,
              marginTop: 22,
              borderWidth: 1,
              borderColor: "#42aec2",
              borderRadius: 8,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 5
            }}
          >
            <View //............Picker
              style={{
                flex: 1,
                paddingtop: 18,
                justifyContent: "space-evenly",
                alignItems: "flex-start"
                //paddingLeft: LeftPadding
              }}
            >
              <View //text/textInput
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 100,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
                  <TextInput
                    style={{
                      height: "100%",
                      width: "100%",
                      fontSize: widthPercentageToDP("3.4%"),
                      color: "#000",
                      paddingLeft: 10
                    }}
                    autoCapitalize="words"
                    value={this.state.pujaPerson}
                    onChangeText={txt => this.setState({ pujaPerson: txt })}
                    placeholder="Puja to be perform in the name of"
                  />
                </View>
              </View>
              <View //datePicker
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 100,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: this.state.borderColor,
                  borderRadius: 8
                }}
              >
                <TouchableOpacity //....calender
                  style={{
                    height: "100%",
                    width: "100%",
                    // borderRadius: 8,
                    // borderWidth: 1,
                    // borderColor: "#42aec2",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingRight: 10
                  }}
                  onPress={() => this.setState({ isDatePickerVisible: true })}
                >
                  <Text
                    style={{
                      color: "#000",
                      fontSize: widthPercentageToDP("3.4%")
                    }}
                  >
                    {this.state.borderColor == "#42aec2"
                      ? this.state.date
                      : "selected date unavailable"}
                  </Text>
                  <Image
                    source={require("./../src/calendar.png")}
                    style={{ width: 30, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
              </View>
              <View //picker1
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 100,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8,
                  justifyContent: "center"
                }}
              >
                {Platform.OS === "android" ? (
                  <Picker
                    selectedValue={this.state.occasion}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      const viewHeightDefault = screenHeight / 2 + 120;
                      const viewHeightExtended = screenHeight / 2 + 120 + 120;

                      if (itemValue == "Other") {
                        this.setState({
                          occasion: itemValue,
                          viewHeight: viewHeightExtended
                        });
                      } else {
                        this.setState({
                          occasion: itemValue,
                          viewHeight: viewHeightDefault
                        });
                      }
                    }}
                  >
                    {occasionArr.map((item, index) => (
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
                    selectedValue={this.state.occasion}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      const viewHeightDefault = screenHeight / 2 + 120;
                      const viewHeightExtended = screenHeight / 2 + 120 + 30;

                      if (itemValue == "Other") {
                        this.setState({
                          occasion: itemValue,
                          viewHeight: viewHeightExtended
                        });
                      } else {
                        this.setState({
                          occasion: itemValue,
                          viewHeight: viewHeightDefault
                        });
                      }
                    }}
                  >
                    {occasionArr.map((item, index) => (
                      <Picker.Item
                        key={index.toString()}
                        label={item}
                        value={item}
                      />
                    ))}
                  </IOSPicker>
                )}
              </View>
              {this.state.occasion == "Other" ? (
                <View //Comment
                  style={{
                    height: heightPercentageToDP("15%"),
                    width: screenWidth - 100,
                    borderWidth: 1,
                    alignSelf: "center",
                    borderColor: this.state.commentBColor,
                    borderRadius: 8
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row"
                    }}
                  >
                    <TextInput
                      style={{
                        height: "100%",
                        width: "100%",
                        fontSize: widthPercentageToDP("3.3%"),
                        color: "#000",
                        textAlignVertical: "top",
                        paddingLeft: 10
                      }}
                      multiline={true}
                      maxLength={340}
                      value={this.state.comment}
                      onChangeText={txt => this.setState({ comment: txt })}
                      placeholder="COMMENTS"
                    />
                  </View>
                </View>
              ) : null}
            </View>
            <View
              style={{
                flex: 0.5,
                paddingtop: 18,
                alignItems: "center"
                //backgroundColor: "red"
                //paddingLeft: LeftPadding
              }}
            >
              <View style={{ flex: 0.5, flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ checkTerms: !this.state.checkTerms })
                  }
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 2,
                    overflow: "visible",
                    borderWidth: 1,
                    borderColor: "#42aec2",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {this.state.checkTerms ? (
                    <Icon name="check" size={15} color="#42aec2" />
                  ) : null}
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.1%"),
                    color: "#454545",
                    paddingLeft: 10
                  }}
                >
                  I AGREE TO THE
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible: true });
                  }}
                  style={{ paddingLeft: 5 }}
                >
                  <Text
                    style={{
                      color: "#42aec2",
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP("3.1%")
                    }}
                  >
                    TERMS & CONDITIONS
                  </Text>
                </TouchableOpacity>
              </View>

              <View //............................buyNow Btn
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 50,
                    backgroundColor:
                      this.state.checkTerms &&
                      this.state.pujaPerson &&
                      this.state.borderColor == "#42aec2"
                        ? "#42aec2"
                        : "rgb(237,236,237)",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 10,
                    borderRadius: 8
                  }}
                  onPress={this.postBuyNow}
                  disabled={
                    !(
                      this.state.checkTerms &&
                      this.state.pujaPerson &&
                      this.state.borderColor == "#42aec2"
                    )
                  }
                >
                  <Text
                    style={{
                      color:
                        this.state.checkTerms &&
                        this.state.pujaPerson &&
                        this.state.borderColor == "#42aec2"
                          ? "#fff"
                          : "#454545",
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP("3.1%"),
                      textTransform: "uppercase"
                    }}
                  >
                    Buy now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ width: "100%", height: 18 }} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
