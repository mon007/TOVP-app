import React from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Picker,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Platform,
  Linking,
  TouchableHighlight
} from "react-native";
import NavBar from "../navBar";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import { WebView } from "react-native-webview";
import { TermsPrivacy } from "../termsPrivacy";
import RazorpayCheckout from "react-native-razorpay";
import { exchange } from "./exchangeRateUtility";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import NetInfo from "@react-native-community/netinfo";
import { apiUrl, paypalApiUrl, razorpayKey } from "../config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import IOSPicker from "react-native-ios-picker";
//import RedirectRecurring from "./redirectToRecurring";

const AnimateBtn = Animated.createAnimatedComponent(TouchableOpacity);
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const LeftPadding = 120 / 2 - (screenWidth - 0.9 * screenWidth) / 2;
let transactionFee;
let prevProductId;
var maxLimit;
var minLimit;
const currencyArr = [
  { code: "USD", name: "Dollar" },
  // { code: "INR", name: "INR" },
  { code: "EUR", name: "Euros" },
  { code: "GBP", name: "Pound Sterling" },
  { code: "AUD", name: "Australian Dollars" },
  { code: "CNY", name: "Chinese Yuan" }
];

const numberOfBricks = [
  { name: "One Radha-Madhava Brick", value: 1, dollar: 2500 },
  { name: "Two Radha-Madhava Bricks", value: 2, dollar: 5000 },
  { name: "Three Radha-Madhava Bricks", value: 3, dollar: 7500 },
  { name: "Four Radha-Madhava Bricks", value: 4, dollar: 10000 },
  { name: "Five Radha-Madhava Bricks", value: 5, dollar: 12500 }
];
var currency;
const timePicker = ["08.00 am", "12.00 pm", "04.00 pm"];
const flags = [
  {
    name: "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag",
    amount: "701.00"
  },
  { name: "Nrsimhadeva's Dome Flag", amount: "501.00" },
  { name: "Planetarium Dome Flag", amount: "501.00" }
];
const currencySymbol = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥"
};
export default class VictoryFlag extends React.Component {
  constructor(props) {
    super(props);
    this.navBarAnimate = new Animated.Value(1);
    this.buttonAnimate = new Animated.Value(0);
  }
  state = {
    totalPicker: "USD",
    money: null,
    moneyArr: {},
    customAmount: "",
    installment: null,
    customAmountRadio: false,
    checkBtn: false,
    emi: false,
    installmentsChechBtn: [false, false, false, false, false, false, false],
    installmentArr: [1, 3, 6, 12, 18, 24, 30, 36],
    visible: false,
    exchangeRate: null,
    receiptVisible: false,
    posted: 0,
    numberOfBricks: "One Radha-Madhava Brick",
    numberOfBricksAmount: 1,
    termsVisible: false,
    paymentPopVisible: false,
    transactionFee: 0,
    agree: false,
    isDatePickerVisible: false,
    date: moment(Date.now())
      .add(1, "day")
      .format("DD-MM-YYYY"),
    time: "",
    timeSlot: [],
    flag: "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag",
    amount: null,
    flagData: null,
    timePicker: [],
    paymentCancelled: false,
    activityI: false,
    paymentProcessing: false,
    statusBarColor: "#007e92",
    navBarColor: "rgb(246,166,36)",
    paymentSuccess: false,
    pending: false,
    city: "",
    userState: "",
    pinCode: "",
    panNumber: "",
    address: "",
    country: "",
    productPaymentId: "",
    razorpayModal: false,
    razorpayModalURI: ""
    //redirectRecurring: false
  };
  componentDidMount() {
    //this.setState({ paymentPopVisible: true });
    this.getProfileInfo();
    //this.checkEmi();
    let amount;
    let flagArr = this.props.arr[this.props.index].flags;
    let flagObj = {};
    for (i = 0; i < flagArr.length; i++) {
      flagObj[flagArr[i].name] = flagArr[i].amounts;
    }
    if (this.props.country == "India") {
      if (this.checkSpecialDays(this.state.date)) {
        amount = this.props.arr[this.props.index].specialPrice["INR"].toFixed(
          2
        );
      } else {
        amount = flagObj[flagArr[0].name]["INR"];
      }
      this.setState({
        paymentMode: "razorPay",
        totalPicker: "INR",
        paymentPopVisible: false,
        flagData: flagObj,
        amount
      });
      this.getExchangeRates("razorPay");
    } else {
      if (this.checkSpecialDays(this.state.date)) {
        amount = this.props.arr[this.props.index].specialPrice["USD"].toFixed(
          2
        );
      } else {
        amount = flagObj[flagArr[0].name]["USD"];
      }
      this.setState({
        paymentMode: "paypal",
        paymentPopVisible: false,
        flagData: flagObj,
        amount
      });
      this.getExchangeRates("paypal");
    }
    this.getSlots(
      moment(new Date())
        .add(1, "day")
        .format("DD-MM-YYYY"),
      flags[0].name
    );
  }
  // checkEmi = () => {
  //   console.log(this.props.userId, this.props.arr[this.props.index]);
  //   fetch(
  //     `${apiUrl}user/checkemi?userId=${this.props.userId}&productId=${
  //       this.props.arr[this.props.index]["_id"]
  //     }`
  //   )
  //     .then(res => res.json())
  //     .then(resJson => {
  //       if (resJson) {
  //         console.log("flag", resJson);
  //         this.setState({ redirectRecurring: true });
  //       }
  //     })
  //     .catch(e => console.log("error", e));
  // };
  getExchangeRates = paymentMode => {
    let timeOut = setTimeout(() => alert("Slow Network Connectivity"), 6000);
    fetch(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=INR,USD,EUR,GBP,AUD,CNY"
    )
      .then(res => res.json())
      .then(resJson => {
        clearTimeout(timeOut);
        this.setState({
          exchangeRate: resJson
        });
      })
      .catch(error => console.log(error));
  };
  razorPay = () => {
    let amount;
    amount = (
      Number(this.state.amount) +
      (this.state.checkBtn ? Number(transactionFee) : 0)
    ).toFixed(2);

    var options = {
      description: "TOVP",
      image: this.props.arr[this.props.index].imgs[1],
      //"https://cdn.tovp.org/wp-content/uploads/2013/01/fotovp-trans-noshadow.png",
      currency: this.state.totalPicker,
      key: razorpayKey,
      amount: (amount * 100 + 30).toFixed(2),
      name: this.state.flag,
      theme: { color: "#42AEC2" }
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        this.setState({
          paymentProcessing: true,
          statusBarColor: "rgb(249,183,77)",
          navBarColor: "rgb(246,166,36)",
          pending: false
        });
        this.props.autoCaptureRazorPay(
          data.razorpay_payment_id,
          (amount * 100 + 30).toFixed(2)
        );
        this.onSuccess("razorpay", data.razorpay_payment_id);
      })
      .catch(error => {
        // handle failure
        console.log(error);
        this.setState({
          paymentPopVisible: false,
          paymentCancelled: true,
          paymentProcessing: true,
          statusBarColor: "rgb(221,80,63)",
          navBarColor: "rgb(234,87,67)",
          pending: false
        });
        this.postPending("razorPay", "Failed");
        Animated.spring(this.navBarAnimate, {
          toValue: 0
        }).start();
      });
  };
  installmentsBtnPress = index => {
    let arr = [].concat(this.state.installmentsChechBtn);
    for (i = 0; i < arr.length; i++) {
      if (i == index) {
        arr[i] = true;
      } else {
        arr[i] = false;
      }
    }
    this.setState({ installmentsChechBtn: arr });
  };
  onNavigationChange = data => {
    console.log("279", data);
    if (data.title == "success") {
      let url = data.url;
      let pair = [];
      let vars = url.split("&");
      for (i = 0; i < vars.length; i++) {
        pair[i] = vars[i].split("=");
      }
      console.log(pair);
      let transactionId = pair[3][1];
      this.setState({
        paymentProcessing: true,
        statusBarColor: "rgb(249,183,77)",
        navBarColor: "rgb(246,166,36)",
        pending: false,
        visible: false
      });
      this.onSuccess("paypal", transactionId);
    } else if (data.title == "cancel") {
      this.setState({
        visible: false,
        paymentPopVisible: false,
        paymentCancelled: true,
        paymentProcessing: true,
        statusBarColor: "rgb(221,80,63)",
        navBarColor: "rgb(234,87,67)",
        pending: false
      });
      this.postPending("paypal", "Failed");
      Animated.spring(this.navBarAnimate, {
        toValue: 0
      }).start();
    } else {
      return;
    }
  };

  razorpayNavigationChange = data => {
    console.log(data);
    // if (data.title.search("email") > 0) {
    //   let url = data.url;
    //   let pair = [];
    //   let vars = url.split("&");
    //   for (i = 0; i < vars.length; i++) {
    //     pair[i] = vars[i].split("=");
    //   }
    //   console.log(pair);
    //   console.log(Object.fromEntries(pair));
    // }
    if (data.title == "success") {
      this.setState({
        paymentProcessing: true,
        paymentPopVisible: false,
        razorpayModal: false,
        paymentID: data.transactionId,
        date: data.date,
        paymentMethod: data.paymentMethod,
        transactionAmount: data.amount,
        receiptVisible: true,
        posted: 0,
        activityI: false,
        paymentSuccess: true,
        navBarColor: "rgb(94,170,70)",
        statusBarColor: "rgb(82,157,58)"
      });
      Animated.spring(this.buttonAnimate, {
        toValue: 1
      }).start();
    } else if (data.title == "cancel") {
      this.setState({
        razorpayModal: false,
        paymentPopVisible: false,
        paymentCancelled: true,
        paymentProcessing: true,
        statusBarColor: "rgb(221,80,63)",
        navBarColor: "rgb(234,87,67)",
        pending: false
      });
      Animated.spring(this.navBarAnimate, {
        toValue: 0
      }).start();
    } else {
      return;
    }
  };
  // onSuccess = mode => {
  //   this.setState({ posted: 1, activityI: true });
  //   url = `${apiUrl}flag/update`;

  //   fetch(url, {
  //     method: "POST",
  //     headers: {
  //       authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       paymentId: this.state.productPaymentId,
  //       offsetInHours: new Date().getTimezoneOffset() / 60,
  //       productId: this.props.arr[this.props.index]._id,
  //       flagName: this.state.flag,
  //       userId: this.props.userId,
  //       date: this.state.date,
  //       time: this.state.time,
  //       paymentMode: mode,
  //       currencyType: this.state.totalPicker,
  //       amount: Number(Number(this.state.amount).toFixed(2))
  //     })
  //   })
  //     .then(res => {
  //       let data = res.json();
  //       let status = res.status;
  //       return Promise.all([status, data]);
  //     })
  //     .then(([status, data]) => {
  //       if (status == 200 || data.message == "error sending sms") {
  //         this.getSlots(
  //           moment(Date.now())
  //             .add(1, "day")
  //             .format("DD-MM-YYYY"),
  //           this.state.flag
  //         );
  //         this.setState({
  //           paymentPopVisible: false,
  //           visible: false,
  //           receiptVisible: true,
  //           paymentID: data.paymentId,
  //           date: data.date,
  //           paymentMethod: data.paymentMethod,
  //           transactionAmount: data.amount,
  //           posted: 0,
  //           activityI: false,
  //           paymentSuccess: true,
  //           navBarColor: "rgb(94,170,70)",
  //           statusBarColor: "rgb(82,157,58)"
  //         });
  //         Animated.spring(this.navBarAnimate, {
  //           toValue: 1
  //         }).start();
  //       }
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.setState({
  //         paymentPopVisible: false,
  //         visible: false,
  //         receiptVisible: false,
  //         posted: 0,
  //         activityI: false
  //       });
  //     });
  // };
  onSuccess = (mode, transactionId) => {
    this.setState({ posted: 1, activityI: true });
    this.props
      .flagPaymentController({
        hasTransactionFee: this.state.checkBtn,
        transactionId: transactionId,
        paymentId: this.state.productPaymentId,
        offsetInHours: new Date().getTimezoneOffset() / 60,
        productId: this.props.arr[this.props.index]._id,
        flagName: this.state.flag,
        userId: this.props.userId,
        date: this.state.date,
        time: this.state.time,
        paymentMode: mode,
        currencyType: this.state.totalPicker,
        amount: Number(Number(this.state.amount).toFixed(2))
      })
      .then(data => {
        if (data) {
          this.getSlots(
            moment(Date.now())
              .add(1, "day")
              .format("DD-MM-YYYY"),
            this.state.flag
          );
          this.setState({
            paymentPopVisible: false,
            visible: false,
            receiptVisible: true,
            paymentID: data.paymentId,
            date: data.date,
            paymentMethod: data.paymentMethod,
            transactionAmount: data.amount,
            posted: 0,
            activityI: false,
            paymentSuccess: true,
            navBarColor: "rgb(94,170,70)",
            statusBarColor: "rgb(82,157,58)"
          });
          Animated.spring(this.buttonAnimate, {
            toValue: 1
          }).start();
        }
      });
  };

  postPending = (mode, payStatus) => {
    this.setState({ posted: 1, activityI: true, pending: true });
    //url = `${apiUrl}flag/pending`;
    fetch(`${apiUrl}pay/pending/${this.props.userId}`, {
      method: "POST",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        offsetInHours: new Date().getTimezoneOffset() / 60,
        paymentId: this.state.productPaymentId
          ? this.state.productPaymentId
          : null,
        //offsetInHours: new Date().getTimezoneOffset() / 60,
        paymentName: this.state.flag,
        //userId: this.props.userId,
        paymentMode: mode,
        currencyType: this.state.totalPicker,
        amount: Number(this.state.amount).toFixed(2),
        paymentStatus: payStatus
      })
    })
      .then(res => {
        let data = res.json();
        let status = res.status;
        return Promise.all([status, data]);
      })
      .then(([status, data]) => {
        if (status == 200) {
          if (data) {
            prevProductId = data;
          }
          this.setState({ productPaymentId: data });
          if (this.state.paymentMode == "paypal" && payStatus == "Pending") {
            this.setState({ visible: true });
          } else if (
            this.state.paymentMode == "razorPay" &&
            payStatus == "Pending"
          ) {
            this.razorPay();
          }
        } else {
          alert("Something went wrong");
        }
      })
      .catch(e => console.log(e));
  };
  getSlots = (date, flag) => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        let status;
        fetch(apiUrl + "flag/" + date + "?flagName=" + flag)
          .then(res => {
            status = res.status;
            return res.json();
          })
          .then(resJson => {
            if (status == 200) {
              this.setState({ timePicker: resJson, time: resJson[0] });
            } else {
              let timePicker = [].concat(this.state.timePicker);
              timePicker = [];
              this.setState({ timePicker, time: "" });
            }
          })
          .catch(e => console.log(e));
      } else {
        alert("Network error");
      }
    });
  };
  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          city: resJson.city,
          userState: resJson.state,
          pinCode: resJson.pinCode,
          panNumber: resJson.panNo,
          address: resJson.address,
          country: resJson.country
        });
      })
      .catch(e => console.log(e));
  };
  checkSpecialDays = date => {
    let sortedArr;
    if (this.props.arr[this.props.index].specialDays) {
      sortedArr = this.props.arr[this.props.index].specialDays.sort((a, b) => {
        if (
          moment(a, "DD-MM-YYYY").valueOf() > moment(b, "DD-MM-YYYY").valueOf()
        ) {
          return 1;
        } else {
          return -1;
        }
      });
      for (i = 0; i < sortedArr.length; i++) {
        if (date == sortedArr[i]) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  };
  render() {
    //console.log(this.props.arr[this.props.index]);
    if (this.state.amount) {
      transactionFee = (
        this.props.arr[this.props.index].transactionFee[
          this.state.paymentMode
        ] * Number(this.state.amount)
      ).toFixed(2);
    } else {
      transactionFee = 0;
    }
    let paypalMoney =
      Number(this.state.amount) +
      (this.state.checkBtn ? Number(transactionFee) : 0);
    const animatedNAvHeight = this.navBarAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1 * screenHeight, 0.3 * screenHeight]
    });

    const animatedDoneBtn = this.buttonAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 0]
    });

    return (
      <React.Fragment>
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

        <StatusBar
          backgroundColor={this.state.statusBarColor}
          barStyle="light-content"
        />
        {/* <Modal //...............Redirect to recurring tab
          visible={this.state.redirectRecurring}
          transparent={true}
          onRequestClose={() => {
            this.setState({ redirectRecurring: false });
          }}
        >
          <RedirectRecurring
            cancel={() => {
              this.setState({ redirectRecurring: false });
            }}
            continue={() => {
              this.setState({ redirectRecurring: false });
              Actions.replace("donorAccount");
            }}
          />
        </Modal> */}
        <Modal //....................PaymentProcessing
          visible={this.state.paymentProcessing}
          style={{ flex: 1 }}
          onRequestClose={() => {
            this.setState({
              paymentProcessing: false,
              paymentSuccess: false,
              statusBarColor: "#007e92",
              paymentCancelled: false
            });
            this.navBarAnimate.setValue(0);
            if (this.state.paymentCancelled) {
              Actions.pop();
            } else {
              Actions.replace("donorAccount");
            }
          }}
        >
          <View style={{ flex: 1 }}>
            {Platform.OS === "ios" ? (
              <View
                style={{
                  height: getStatusBarHeight(true),
                  width: "100%",
                  backgroundColor: this.state.statusBarColor
                }}
              ></View>
            ) : null}
            <Animated.View //..........................NavBar
              style={{
                width: "100%",
                height: animatedNAvHeight,
                backgroundColor: this.state.navBarColor,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("4%")
                  }}
                >
                  {this.state.paymentSuccess
                    ? "Transaction Successful"
                    : this.state.paymentCancelled
                    ? "Transaction Failed"
                    : "Transaction Pending"}
                </Text>
                {this.state.paymentSuccess ? (
                  <View
                    style={{
                      width: "100%",
                      height: 90,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={require("../../src/success1.png")}
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                    />
                  </View>
                ) : null}
                {!this.state.paymentSuccess && !this.state.paymentCancelled ? (
                  <View
                    style={{
                      width: "100%",
                      height: 90,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={require("../../src/Clock-Widget.gif")}
                      style={{ width: 90, height: 90, resizeMode: "contain" }}
                    />
                  </View>
                ) : null}
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.2%")
                  }}
                >
                  {moment(new Date()).format("LL")} at{" "}
                  {moment(new Date()).format("h:mm a")}
                </Text>
              </View>
              <TouchableOpacity //........................leftArrow
                onPress={() => {
                  this.setState({
                    paymentProcessing: false,
                    paymentSuccess: false,
                    statusBarColor: "#007e92",
                    paymentCancelled: false
                  });
                  this.navBarAnimate.setValue(0);
                  if (this.state.paymentCancelled) {
                    Actions.pop();
                  } else {
                    Actions.replace("donorAccount");
                  }
                }}
                style={{
                  height: 0.1 * screenHeight,
                  width: 60,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  name="arrow-left"
                  color="#fff"
                  size={widthPercentageToDP("4%")}
                />
              </TouchableOpacity>
            </Animated.View>
            {this.state.paymentSuccess ? null : (
              <View //..................Note
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {this.state.paymentCancelled ? (
                  <Text
                    style={{
                      color: "rgb(210,85,62)",
                      fontFamily: "Montserrat-Regular",
                      fontSize: widthPercentageToDP("3.4%"),
                      textAlign: "center"
                    }}
                  >
                    Transaction declined by the bank
                  </Text>
                ) : (
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        color: "rgb(246,166,36)",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.4%"),
                        textAlign: "center"
                      }}
                    >
                      Your transaction is being processed.
                    </Text>
                    <Text
                      style={{
                        color: "rgb(246,166,36)",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.4%"),
                        textAlign: "center"
                      }}
                    >
                      Please don't click back button.
                    </Text>
                  </View>
                )}
              </View>
            )}
            <View //.....................Seperator
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "rgb(238,238,238)",
                alignSelf: "center"
              }}
            />
            <View //.....................ItemName
              style={{
                width: "100%",
                aspectRatio: 5 / 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                paddingLeft: 18
              }}
            >
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Item Name
              </Text>
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-SemiBold"
                }}
              >
                {this.props.arr[this.props.index].title}
              </Text>
            </View>
            <View //.....................Seperator
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "rgb(238,238,238)",
                alignSelf: "center"
              }}
            />
            {this.state.paymentMode == "paypal" ? (
              <View //.....................Transaction Id
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  paddingLeft: 18
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular"
                  }}
                >
                  Transaction Id
                </Text>
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold"
                  }}
                >
                  {this.state.productPaymentId
                    ? this.state.productPaymentId
                    : prevProductId}
                </Text>
              </View>
            ) : null}
            <View //.....................Seperator
              style={{
                width: "100%",
                height: 10,
                alignSelf: "center",
                backgroundColor: "rgb(238,238,238)"
              }}
            />
            <View //.....................PaymentTo
              style={{
                width: "100%",
                aspectRatio: 5 / 1.2,
                backgroundColor: "#fff",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <View //................flex1
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  paddingLeft: 18
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular"
                  }}
                >
                  Payment to
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../src/applogo.png")}
                    style={{ width: 40, height: 25, resizeMode: "contain" }}
                  />
                  <Text
                    style={{
                      color: "rgb(69,69,69)",
                      fontFamily: "Montserrat-SemiBold"
                    }}
                  >
                    Tovp Iskcon
                  </Text>
                </View>
              </View>
              <View //................flex2
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  paddingRight: 18,
                  alignItems: "flex-end"
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular"
                  }}
                >
                  Amount
                </Text>
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold"
                  }}
                >
                  {currencySymbol[this.state.totalPicker]}
                  {(
                    paypalMoney -
                    (this.state.checkBtn ? Number(transactionFee) : 0).toFixed(
                      2
                    )
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
            <View //.....................Seperator
              style={{
                width: "100%",
                height: 10,
                alignSelf: "center",
                backgroundColor: "rgb(238,238,238)"
              }}
            />
            <View //......................paymentMode
              style={{
                width: "100%",
                aspectRatio: 5 / 1.2,
                backgroundColor: "#fff",
                justifyContent: "space-evenly",
                paddingLeft: 18
              }}
            >
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-Regular"
                }}
              >
                Payment Mode
              </Text>
              <View style={{ flexDirection: "row" }}>
                {this.state.paymentMode == "paypal" ? (
                  <Image
                    source={require("../../src/paypal.png")}
                    style={{ width: 40, height: 25, resizeMode: "contain" }}
                  />
                ) : (
                  <Image
                    source={require("../../src/razorPay.png")}
                    style={{ width: 40, height: 25, resizeMode: "contain" }}
                  />
                )}
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold"
                  }}
                >
                  {this.state.paymentMode}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "rgb(238,238,238)" }}>
              <AnimateBtn
                style={{
                  width: "100%",
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  position: "absolute",
                  left: 0,
                  bottom: animatedDoneBtn
                }}
                onPress={() => {
                  this.setState({
                    paymentProcessing: false,
                    paymentSuccess: false,
                    statusBarColor: "#007e92",
                    paymentCancelled: false
                  });
                  this.navBarAnimate.setValue(0);
                  if (this.state.paymentCancelled) {
                    Actions.pop();
                  } else {
                    Actions.replace("donorAccount");
                  }
                }}
              >
                <Text
                  style={{
                    color: "rgb(66,174,194)",
                    fontFamily: "Montserrat-Bold",
                    fontSize: widthPercentageToDP("3.5%")
                  }}
                >
                  Done
                </Text>
              </AnimateBtn>
            </View>
          </View>
        </Modal>
        <Modal //....................ActivityI
          visible={false} //{this.state.activityI}
          transparent={true}
          style={{ flex: 1 }}
        >
          <View
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator
              color="#000"
              size={Platform.OS === "android" ? 18 : 1}
              visible={this.state.activityI}
            />
          </View>
        </Modal>
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          onConfirm={date => {
            if (date > new Date()) {
              this.getSlots(moment(date).format("DD-MM-YYYY"), this.state.flag);
              if (this.checkSpecialDays(moment(date).format("DD-MM-YYYY"))) {
                this.setState({
                  date: moment(date).format("DD-MM-YYYY"),
                  isDatePickerVisible: false,
                  amount: this.props.arr[this.props.index].specialPrice[
                    this.state.totalPicker
                  ].toFixed(2)
                });
              } else {
                this.setState({
                  date: moment(date).format("DD-MM-YYYY"),
                  isDatePickerVisible: false,
                  amount: Number(
                    this.state.flagData[this.state.flag][this.state.totalPicker]
                  ).toFixed(2)
                });
              }
            } else {
              this.setState({
                date: "",
                isDatePickerVisible: false
              });
            }
          }}
          onCancel={() => this.setState({ isDatePickerVisible: false })}
        />
        <Modal //...payment Cancelled
          visible={false} //{this.state.paymentCancelled}
          transparent={true}
          onRequestClose={() => {
            this.setState({ paymentCancelled: false });
            Actions.pop();
          }}
        >
          <TouchableOpacity
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)"
            }}
            onPress={() => {
              this.setState({ paymentCancelled: false });
              Actions.pop();
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                width: "90%",
                height: screenHeight / 2,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 1.5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 65,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: -30,
                    alignSelf: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <Image
                    source={require("../../src/warning.png")}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "contain"
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.4%")
                  }}
                >
                  Sorry
                </Text>
                <Text
                  style={{
                    color: "#aaaaaa",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.2%")
                  }}
                >
                  Your transaction was unsuccessful
                </Text>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 1,
                    borderStyle: "dashed",
                    position: "absolute",
                    bottom: 1,
                    width: screenWidth / 1.5,
                    alignSelf: "center"
                  }}
                />
              </View>
              <View style={{ flex: 2.5, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>DATE</Text>
                    <Text style={styles.modalTxt2}>
                      {moment(new Date()).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>AMOUNT</Text>
                    <Text style={styles.modalTxt2}>{this.state.amount}</Text>
                  </View>
                </View>
                <View style={styles.modalV}>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>TIME</Text>
                    <Text style={styles.modalTxt2}>
                      {moment(new Date()).format("hh:mm:ss")}
                    </Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>PAYMENT METHOD</Text>
                    <Text style={styles.modalTxt2}>
                      {this.state.paymentMode}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#d75a4a",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 50
                  }}
                  onPress={() => {
                    this.setState({ paymentCancelled: false });
                    Actions.pop();
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("5%"),
                      color: "#fff"
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        {/* <Modal //...............Payment popUp
          visible={this.state.paymentPopVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({ paymentPopVisible: false });
            Actions.pop();
          }}
        >
          <TouchableOpacity
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)"
            }}
            onPress={() => {
              this.setState({ paymentPopVisible: false });
              Actions.pop();
            }}
          >
            <TouchableOpacity
              onStartShouldSetResponder={() => true}
              style={{
                backgroundColor: "white",
                width: "90%",
                height: screenHeight / 2 - 110,
                borderRadius: 10,
                zIndex: 2,
                padding: 18,
                borderWidth: 0.5,
                borderColor: "#42aec2"
              }}
            >
              
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("4%")
                  }}
                >
                  Payment Modes
                </Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-evenly",
                    alignItems: "flex-start"
                  }}
                >
                  <TouchableOpacity //...............paypal
                    style={{
                      width: "98%",
                      height: heightPercentageToDP("7.5%"),
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: "#42aec2",
                      elevation: 10
                    }}
                    onPress={() => {
                      this.setState({
                        paymentMode: "paypal",
                        paymentPopVisible: false
                      });
                      this.getExchangeRates("paypal");
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        source={require("../../src/paypal.png")}
                        style={{ width: 30, height: 30, resizeMode: "contain" }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 5,
                        justifyContent: "center",
                        alignItems: "flex-start"
                      }}
                    >
                      <Text
                        style={{
                          color: "#454545",
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: widthPercentageToDP("3.3%")
                        }}
                      >
                        Paypal
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: "center",
                        alignItems: "flex-start"
                      }}
                    >
                      <Icon name="chevron-right" color="#000" />
                    </View>
                  </TouchableOpacity>
                  {this.props.pickerType == "India" ? (
                    <TouchableOpacity //....................razorPay
                      style={{
                        width: "98%",
                        height: heightPercentageToDP("7.5%"),
                        flexDirection: "row",
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: "#42aec2",
                        elevation: 10
                      }}
                      onPress={() => {
                        this.setState({
                          paymentMode: "razorPay",
                          totalPicker: "INR",
                          paymentPopVisible: false
                        });
                        this.getExchangeRates("razorPay");
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Image
                          source={require("../../src/razorPay.png")}
                          style={{
                            width: 30,
                            height: 30,
                            resizeMode: "contain"
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 5,
                          justifyContent: "center",
                          alignItems: "flex-start"
                        }}
                      >
                        <Text
                          style={{
                            color: "#454545",
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: widthPercentageToDP("3.3%")
                          }}
                        >
                          Razorpay
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.5,
                          justifyContent: "center",
                          alignItems: "flex-start"
                        }}
                      >
                        <Icon name="chevron-right" color="#000" />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal> */}
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
        <Modal //...receipt
          visible={false} //{this.state.receiptVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({ receiptVisible: false });
            Actions.replace("donorAccount");
          }}
        >
          <TouchableOpacity
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)"
            }}
            onPress={() => {
              this.setState({ receiptVisible: false });
              Actions.replace("donorAccount");
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                width: "90%",
                height: screenHeight / 2,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flex: 1.5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 65,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: -30,
                    alignSelf: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <Image
                    source={require("../../src/check.png")}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "contain"
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.4%")
                  }}
                >
                  Thank You!
                </Text>
                <Text
                  style={{
                    color: "#aaaaaa",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.2%")
                  }}
                >
                  Your transaction was successful
                </Text>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 1,
                    borderStyle: "dashed",
                    position: "absolute",
                    bottom: 1,
                    width: screenWidth / 1.5,
                    alignSelf: "center"
                  }}
                />
              </View>
              <View style={{ flex: 2.5, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>DATE</Text>
                    <Text style={styles.modalTxt2}>{this.state.date}</Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>To</Text>
                    <Text style={styles.modalTxt2}>ISKCON TOVP</Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>AMOUNT</Text>
                    <Text style={styles.modalTxt2}>{this.state.amount}</Text>
                  </View>
                </View>
                <View style={styles.modalV}>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>TIME</Text>
                    <Text style={styles.modalTxt2}>
                      {moment(new Date()).format("hh:mm:ss")}
                    </Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>PAYMENT METHOD</Text>
                    <Text style={styles.modalTxt2}>
                      {this.state.paymentMode}
                    </Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>PAYMENT ID</Text>
                    <Text
                      style={[
                        styles.modalTxt2,
                        { fontSize: widthPercentageToDP("3.1%") }
                      ]}
                    >
                      {this.state.paymentID}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#d75a4a",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 50
                  }}
                  onPress={() => {
                    this.setState({ receiptVisible: false });
                    Actions.replace("donorAccount");
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("5%"),
                      color: "#fff"
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal //..............paypalWebview
          visible={this.state.visible}
          onRequestClose={() => {
            this.setState({
              visible: false,
              paymentPopVisible: false,
              paymentCancelled: true,
              paymentProcessing: true,
              statusBarColor: "rgb(221,80,63)",
              navBarColor: "rgb(234,87,67)",
              pending: false
            });
            this.postPending("paypal", "Failed");
          }}
        >
          <React.Fragment>
            {Platform.OS === "ios" ? (
              <View style={{ width: "100%", height: 12 }} />
            ) : null}
            <WebView
              source={{
                html: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                  <title>Document</title>
                  <style>
                     input { 
                     visibility: hidden; 
                    * {
                      margin: 0;
                      padding: 0;
                    }
                    body {
                      height: 100vh;
                      font-family: monospace;
                      color: rgba(0, 0, 0, 0.7);
                    }
                  </style>
                </head>
                <body onload="document.f1.submit();">
                  <div
                    style="display: flex; align-items: center; height: 100%; justify-content: center"
                  >
                    <h1 style="text-align: center">Please wait...</h1>
                  </div>
                  <form name="f1" id="f1" action=${paypalApiUrl}>
                    <input name="price" value="${
                      this.state.exchangeRate
                        ? this.state.totalPicker == "INR" ||
                          this.state.totalPicker == "CNY" ||
                          (this.state.totalPicker == "AUD" &&
                            this.state.flag ==
                              "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag") ||
                          this.state.totalPicker == "GBP"
                          ? Number(
                              (
                                paypalMoney /
                                this.state.exchangeRate["rates"][
                                  this.state.totalPicker
                                ]
                              ).toFixed(2)
                            )
                          : Number(paypalMoney)
                        : 0
                    }" id="price" />
                    <input name="name" value="${this.state.flag}" id="name" />
                    <input name="currency" value="${
                      this.state.totalPicker == "INR" ||
                      this.state.totalPicker == "CNY" ||
                      (this.state.totalPicker == "AUD" &&
                        this.state.flag ==
                          "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag") ||
                      this.state.totalPicker == "GBP"
                        ? "USD"
                        : this.state.totalPicker
                    }" id="currency" />
                    <input name="userId" value="${
                      this.props.userId
                    }" id="userId" />
                    <input name="description" value="Tovp" id="description" />
                  </form>
                </body>
              </html>
              `
              }}
              onNavigationStateChange={data => this.onNavigationChange(data)}
              // injectedJavaScript={`document.querySelector('#name').value="nsajnsas";
              // document.querySelector('#price').value='1';
              // document.querySelector('#currency').value='${
              //   this.state.totalPicker
              // }';
              // document.querySelector('#description').value='eeeeyo';

              // `}
            />
          </React.Fragment>
        </Modal>
        <Modal //..............razorpayWebview
          visible={this.state.razorpayModal}
          onRequestClose={() => {
            this.setState({
              razorpayModal: false,
              paymentPopVisible: false,
              paymentCancelled: true,
              paymentProcessing: true,
              statusBarColor: "rgb(221,80,63)",
              navBarColor: "rgb(234,87,67)",
              pending: false
            });
            //this.postPending("paypal", "Failed");
            Animated.spring(this.navBarAnimate, {
              toValue: 0
            }).start();
          }}
        >
          <React.Fragment>
            {Platform.OS === "ios" ? (
              <View style={{ width: "100%", height: 12 }} />
            ) : null}
            <WebView
              source={{
                uri: this.state.razorpayModalURI
              }}
              onNavigationStateChange={data =>
                this.razorpayNavigationChange(data)
              }
              // injectedJavaScript={`document.querySelector('#name').value="nsajnsas";
              // document.querySelector('#price').value='1';
              // document.querySelector('#currency').value='${
              //   this.state.totalPicker
              // }';
              // document.querySelector('#description').value='eeeeyo';

              // `}
            />
          </React.Fragment>
        </Modal>
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
              source={require("../../src/tovp_bg_10.png")}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
              imageStyle={{ resizeMode: "cover" }}
            >
              <NavBar
                title="Donate"
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
                    flex: 1.8,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      width: "95%",
                      height: "95%",
                      borderRadius: 150
                    }}
                  >
                    <Image
                      source={{ uri: this.props.arr[this.props.index].imgs[0] }}
                      style={{
                        flex: 1,
                        resizeMode: "contain"
                      }}
                    />
                  </View>
                </View>

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
                      fontSize: 18,
                      color: "white",
                      fontFamily: "Montserrat-Bold"
                    }}
                    numberOfLines={3}
                  >
                    {this.props.arr[this.props.index].title}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
          <View //.......................v2
            style={{
              width: "90%",
              height: screenHeight / 2 + heightPercentageToDP("33%"),
              borderRadius: 10,
              alignSelf: "center",
              elevation: 10,
              marginTop: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              borderWidth: 1,
              borderColor: "#42aec2",
              borderRadius: 8,
              backgroundColor: "#fff"
            }}
          >
            <View //............Picker
              style={{
                flex: 3.5,
                paddingtop: 18,
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                paddingLeft: LeftPadding
              }}
            >
              <View //.............picker1
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8
                }}
              >
                {Platform.OS === "android" ? (
                  <Picker
                    selectedValue={this.state.flag}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (this.state.exchangeRate) {
                        if (this.checkSpecialDays(this.state.date)) {
                          this.setState({
                            flag: itemValue,
                            amount: this.props.arr[
                              this.props.index
                            ].specialPrice[this.state.totalPicker].toFixed(2)
                          });
                        } else {
                          this.setState({
                            flag: itemValue,
                            amount: Number(
                              this.state.flagData[itemValue][
                                this.state.totalPicker
                              ]
                            ).toFixed(2)
                          });
                        }

                        this.getSlots(this.state.date, itemValue);
                      }
                    }}
                  >
                    {this.props.arr[this.props.index].flags.map(
                      (item, index) => (
                        <Picker.Item
                          key={index.toString()}
                          label={item.name}
                          value={item.name}
                        />
                      )
                    )}
                  </Picker>
                ) : (
                  <IOSPicker
                    mode="modal"
                    selectedValue={this.state.flag}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (this.state.exchangeRate) {
                        if (this.checkSpecialDays(this.state.date)) {
                          this.setState({
                            flag: itemValue,
                            amount: this.props.arr[
                              this.props.index
                            ].specialPrice[this.state.totalPicker].toFixed(2)
                          });
                        } else {
                          this.setState({
                            flag: itemValue,
                            amount: Number(
                              this.state.flagData[itemValue][
                                this.state.totalPicker
                              ]
                            ).toFixed(2)
                          });
                        }

                        this.getSlots(this.state.date, itemValue);
                      }
                    }}
                  >
                    {this.props.arr[this.props.index].flags.map(
                      (item, index) => (
                        <Picker.Item
                          key={index.toString()}
                          label={item.name}
                          value={item.name}
                        />
                      )
                    )}
                  </IOSPicker>
                )}
              </View>
              <View //.............CalenderTime
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <TouchableOpacity //....calender
                  style={{
                    height: "100%",
                    width: "48%",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#42aec2",
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
                    {this.state.date}
                  </Text>
                  <Image
                    source={require("../../src/calendar.png")}
                    style={{ width: 30, height: 20, resizeMode: "contain" }}
                  />
                </TouchableOpacity>
                <View //.......TimePicker
                  style={{
                    height: "100%",
                    width: "48%",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#42aec2",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 10,
                    paddingRight: 10
                  }}
                >
                  {Platform.OS === "android" ? (
                    <Picker
                      selectedValue={this.state.time}
                      style={{
                        height: "100%",
                        width: "100%"
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          time: itemValue
                        });
                      }}
                    >
                      {this.state.timePicker.map((item, index) => (
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
                      selectedValue={this.state.time}
                      style={{
                        height: "100%",
                        width: "100%"
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          time: itemValue
                        });
                      }}
                    >
                      {this.state.timePicker.map((item, index) => (
                        <Picker.Item
                          key={index.toString()}
                          label={item}
                          value={item}
                        />
                      ))}
                    </IOSPicker>
                  )}
                </View>
              </View>
              <View //.............picker2
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8,
                  justifyContent: "center"
                }}
              >
                {this.props.country == "India" ? (
                  <Text
                    style={{
                      paddingLeft: widthPercentageToDP("3.1%")
                    }}
                  >
                    {this.state.totalPicker}
                  </Text>
                ) : Platform.OS === "android" ? (
                  <Picker
                    selectedValue={this.state.totalPicker}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (this.state.exchangeRate) {
                        let amount;
                        if (this.checkSpecialDays(this.state.date)) {
                          amount = this.props.arr[
                            this.props.index
                          ].specialPrice[this.state.totalPicker].toFixed(2);
                        } else if (this.state.flagData) {
                          amount = this.state.flagData[this.state.flag][
                            itemValue
                          ];
                        }
                        this.setState({
                          totalPicker: itemValue,
                          amount: Number(amount).toFixed(2)
                        });
                      }
                    }}
                  >
                    {currencyArr.map((item, index) => (
                      <Picker.Item
                        key={index.toString()}
                        label={item.name}
                        value={item.code}
                      />
                    ))}
                  </Picker>
                ) : (
                  <IOSPicker
                    mode="modal"
                    selectedValue={this.state.totalPicker}
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      if (this.state.exchangeRate) {
                        let amount;
                        if (this.checkSpecialDays(this.state.date)) {
                          amount = this.props.arr[
                            this.props.index
                          ].specialPrice[this.state.totalPicker].toFixed(2);
                        } else if (this.state.flagData) {
                          amount = this.state.flagData[this.state.flag][
                            itemValue
                          ];
                        }
                        this.setState({
                          totalPicker: itemValue,
                          amount: Number(amount).toFixed(2)
                        });
                      }
                    }}
                  >
                    {currencyArr.map((item, index) => (
                      <Picker.Item
                        key={index.toString()}
                        label={item.name}
                        value={item.code}
                      />
                    ))}
                  </IOSPicker>
                )}
              </View>
              <View //.............Text
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: 10
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontSize: widthPercentageToDP("3.4%")
                  }}
                >
                  {this.state.amount}
                </Text>
              </View>
            </View>
            {this.state.date == "" ? (
              <View //................error
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: LeftPadding
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.3%"),
                    color: "#d2553e"
                  }}
                >
                  *Select date in future
                </Text>
              </View>
            ) : null}

            {this.state.timePicker.length > 0 ? null : (
              <View //................error
                style={{
                  flex: 0.5,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: LeftPadding
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.3%"),
                    color: "#d2553e"
                  }}
                >
                  *No Time Slot available for the selected date
                </Text>
              </View>
            )}
            {this.state.amount == "0.00" ? (
              <View
                style={{
                  width: "90%",
                  height: 68,
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 10,
                  borderRadius: 5,
                  paddingRight: 10,
                  marginBottom: 10,
                  backgroundColor: "#fcf8e3"
                }}
              >
                <Image
                  source={require("../../src/campaign.png")}
                  style={{ width: 18, height: 18, resizeMode: "contain" }}
                />
                <Text
                  style={{
                    color: "#454545",
                    fontSize: widthPercentageToDP("3.2%"),
                    fontFamily: "Montserrat-Regular"
                  }}
                >
                  {" "}
                  Attention: Selected currency currently unavailable.
                </Text>
              </View>
            ) : null}
            <View
              style={{
                width: "90%",
                height: 60,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 10,
                borderRadius: 5,
                paddingRight: 10,
                backgroundColor: "#c0d8fe"
              }}
            >
              <Image
                source={require("../../src/idea_1.png")}
                style={{ width: 18, height: 18, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.2%"),
                  fontFamily: "Montserrat-Regular"
                }}
              >
                {" "}
                If you want to donate by cheque you can directly contact TOVP
                office
              </Text>
            </View>
            <View //.................Terms
              style={{
                flex: 0.8,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: LeftPadding,
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.setState({ termsVisible: true, agree: true })
                }
                style={{
                  width: 160,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: "#42aec2",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 15
                  }}
                >
                  Show Terms
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View //..............radiobtn
              style={{
                flex: 0.5,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: LeftPadding,
                paddingRight: 18,
                paddingTop: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    checkBtn: !this.state.checkBtn
                  });
                }}
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: this.state.checkBtn ? "#42aec2" : "grey",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10
                }}
              >
                {this.state.checkBtn ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#42aec2"
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontSize: widthPercentageToDP("3.2%") }}>
                  I'd like to help cover the transaction fees of{" "}
                  {this.state.totalPicker} {Number(transactionFee).toFixed(2)}{" "}
                  for my donation.
                </Text>
              </View>
            </View> */}
            <View //......................donatebtn
              style={{
                width: "100%",
                aspectRatio: 5 / 1.5,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 20
              }}
            >
              {this.state.agree ? (
                <TouchableOpacity
                  onPress={() => {
                    if (Number(this.state.amount)) {
                      if (
                        this.state.city &&
                        this.state.userState &&
                        this.state.pinCode &&
                        (this.state.country == "India"
                          ? this.state.panNumber
                          : true) &&
                        this.state.address
                      ) {
                        if (this.state.paymentMode == "paypal") {
                          if (Platform.OS == "ios") {
                            let url = `${apiUrl}paypal?offsetInHours=${new Date().getTimezoneOffset() /
                              60}&imgURL=${
                              this.props.arr[this.props.index].imgs[1]
                            }&productId=${
                              this.props.arr[this.props.index]._id
                            }&flagName=${this.state.flag}&userId=${
                              this.props.userId
                            }&date=${this.state.date}&time=${
                              this.state.time
                            }&paypalCurrency=${
                              this.state.totalPicker == "INR" ||
                              this.state.totalPicker == "CNY" ||
                              (this.state.totalPicker == "AUD" &&
                                this.state.flag ==
                                  "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag") ||
                              this.state.totalPicker == "GBP"
                                ? "USD"
                                : this.state.totalPicker
                            }&currencyType=${
                              this.state.totalPicker
                            }&transactionAmount=${
                              this.state.exchangeRate
                                ? this.state.totalPicker == "INR" ||
                                  this.state.totalPicker == "CNY" ||
                                  (this.state.totalPicker == "AUD" &&
                                    this.state.flag ==
                                      "Radha-Madhava/Pancatattva/Guru-parampara Dome Flag") ||
                                  this.state.totalPicker == "GBP"
                                  ? Number(
                                      (
                                        paypalMoney /
                                        this.state.exchangeRate["rates"][
                                          this.state.totalPicker
                                        ]
                                      ).toFixed(2)
                                    )
                                  : Number(paypalMoney)
                                : 0
                            }&perMonthAmount=${Number(
                              Number(this.state.amount).toFixed(2)
                            )}&hasTransactionFee=${
                              this.state.checkBtn ? 1 : 0
                            }`;
                            console.log(url);
                            Linking.openURL(url).catch(err =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.postPending("paypal", "Pending");
                            //this.setState({ visible: true });
                          }
                        } else if (this.state.paymentMode == "razorPay") {
                          //if (Platform.OS == "ios") {
                          let amount1;
                          amount1 = (
                            Number(this.state.amount) +
                            (this.state.checkBtn ? Number(transactionFee) : 0)
                          ).toFixed(2);
                          let url = `${apiUrl}razorpay/browser?offsetInHours=${new Date().getTimezoneOffset() /
                            60}&imgURL=${
                            this.props.arr[this.props.index].imgs[1]
                          }&productId=${
                            this.props.arr[this.props.index]._id
                          }&flagName=${this.state.flag}&userId=${
                            this.props.userId
                          }&date=${this.state.date}&time=${
                            this.state.time
                          }&currencyType=${
                            this.state.totalPicker
                          }&transactionAmount=${amount1}&perMonthAmount=${Number(
                            Number(this.state.amount).toFixed(2)
                          )}&hasTransactionFee=${this.state.checkBtn ? 1 : 0}`;
                          console.log(apiUrl + "razorpay/browser" + url);
                          if (Platform.OS == "ios") {
                            Linking.openURL(url).catch(err =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.setState({
                              razorpayModal: true,
                              razorpayModalURI: url
                            });
                            //this.postPending("razorPay", "Pending");
                            //this.razorPay();
                          }
                        }
                      } else {
                        Toast.show(
                          "Please Update your Profile before donating",
                          Toast.LONG
                        );
                        Actions.replace("profile");
                      }
                    }
                  }}
                  style={{
                    width: 150,
                    height: 40,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    backgroundColor:
                      this.state.date != "" &&
                      !this.state.pending &&
                      this.state.amount != "0.00" &&
                      this.state.timePicker.length > 0
                        ? "#42aec2"
                        : "#dfdfdf"
                  }}
                  disabled={
                    (this.state.date == "" ? true : false) ||
                    !this.state.timePicker.length > 0 ||
                    this.state.pending ||
                    this.state.amount == "0.00"
                  }
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color:
                        this.state.date != "" &&
                        !this.state.pending &&
                        this.state.amount != "0.00" &&
                        this.state.timePicker.length > 0
                          ? "#deffffff"
                          : "#fff"
                    }}
                  >
                    Book
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({ agree: true })}
                  style={{
                    width: 150,
                    height: 40,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 10,
                    borderColor: "#42aec2",
                    borderWidth: 1,
                    backgroundColor: "#fff"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#42aec2",
                      fontSize: 14,
                      fontFamily: "Montserrat-SemiBold"
                    }}
                  >
                    Agree
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View //..................note
            style={[
              styles.noteStyle,
              {
                backgroundColor: "#d9edf7"
              }
            ]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#31708f"
              }}
            >
              Please note that this sponsorship must be paid in full at the time
              of making your payment. The following special holy days (based on
              2019 calendar for Mayapur) will have their sponsorship cost of
              $1008. Gaura Purnima 2022 is not yet available.
            </Text>
          </View>
          <View //..................note
            style={[
              styles.noteStyle,
              {
                backgroundColor: "#fcf8e3"
              }
            ]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#8d703f"
              }}
            >
              ATTENTION: All prices shown in Indian Rupees (INR) are subject to
              change without prior notice due to current exchange rate.
            </Text>
          </View>
          <View style={{ width: "100%", height: 20 }} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  v1: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 5,
    paddingTop: 8,
    justifyContent: "space-evenly"
  },
  txt1: { fontSize: 10, color: "#42aec2", fontFamily: "Montserrat-SemiBold" },
  txtTitle: {
    fontSize: widthPercentageToDP("3.3%"),
    color: "#3e3b3b",
    fontFamily: "Montserrat-Bold"
  },
  modalTxt1: {
    color: "#aaaaaa",
    fontFamily: "Montserrat-Regular",
    fontSize: widthPercentageToDP("3.2%")
  },
  modalTxt2: {
    color: "#454545",
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.4%")
  },
  modalV: { flex: 1, justifyContent: "center", alignItems: "center" },
  noteStyle: {
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    // aspectRatio: 5 / 2.2,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: widthPercentageToDP("3%"),
    marginTop: widthPercentageToDP("3.5%")
  }
});
