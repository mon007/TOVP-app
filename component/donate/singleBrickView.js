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
} from "react-native";
import Toast from "react-native-simple-toast";
import NavBar from "../navBar";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import { WebView } from "react-native-webview";
import { TermsPrivacy } from "../termsPrivacy";
import RazorpayCheckout from "react-native-razorpay";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { exchange } from "./exchangeRateUtility";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import { apiUrl, paypalApiUrl, razorpayKey } from "../config";
import IOSPicker from "react-native-ios-picker";
import RedirectRecurring from "./redirectToRecurring";

const AnimateBtn = Animated.createAnimatedComponent(TouchableOpacity);
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const LeftPadding = 120 / 2 - (screenWidth - 0.9 * screenWidth) / 2;
let transactionFee;
let prevProductId;
const currencyArr = [
  // { code: "INR", name: "INR" },
  { code: "USD", name: "Dollar" },
  { code: "EUR", name: "Euros" },
  { code: "GBP", name: "Pound Sterling" },
  { code: "AUD", name: "Australian Dollars" },
  { code: "CNY", name: "Chinese Yuan" },
];

const numberOfBricks = [
  { name: "One Nrsimhadeva Tile", value: 1, dollar: 2500 },
  { name: "Two Nrsimhadeva Tile", value: 2, dollar: 5000 },
  { name: "Three Nrsimhadeva Tile", value: 3, dollar: 7500 },
  { name: "Four Nrsimhadeva Tile", value: 4, dollar: 10000 },
  { name: "Five Nrsimhadeva Tile", value: 5, dollar: 12500 },
];
var currency;
var maxLimit;
var minLimit;
var maxLimit1;
const currencySymbol = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};
export default class SingleBrickView extends React.Component {
  constructor(props) {
    super(props);
    this.navBarAnimate = new Animated.Value(1);
    this.buttonAnimate = new Animated.Value(0);
    let arr = Object.keys(this.props.arr[this.props.index].brickObj);
    let arr1 = [];
    this.numberOfBricks = [];
    for (i = 0; i < arr.length; i++) {
      let obj = {};
      obj.name = arr[i];
      this.numberOfBricks.push(obj);
    }
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
    installmentsChechBtn: [],
    installmentArr: null,
    visible: false,
    exchangeRate: null,
    receiptVisible: false,
    posted: 0,
    numberOfBricks: `One ${this.props.arr[this.props.index].name}`,
    numberOfBricksAmount: 1,
    termsVisible: false,
    paymentPopVisible: false,
    transactionFee: 0,
    agree: false,
    priceToBrick: "",
    paymentMode: "",
    paymentCancelled: false,
    activityI: false,
    productPaymentId: "",
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
    redirectRecurring: false,
    razorpayModal: false,
    razorpayModalURI: "",
  };
  componentDidMount() {
    //this.setState({ paymentPopVisible: true });
    //this.getExchangeRates();
    //console.log(this.props.arr[this.props.index]);
    console.log(this.props.userId);
    this.getProfileInfo();
    console.log("waaaaa", this.props.arr[this.props.index]["_id"]);
    this.checkEmi();
    if (this.props.country == "India") {
      this.setState({
        paymentMode: "razorPay",
        totalPicker: "INR",
        paymentPopVisible: false,
      });
      this.getExchangeRates("razorPay");
    } else {
      this.setState({
        paymentMode: "paypal",
        paymentPopVisible: false,
      });
      this.getExchangeRates("paypal");
    }
  }

  checkEmi = () => {
    fetch(
      `${apiUrl}user/checkemi?userId=${this.props.userId}&productId=${
        this.props.arr[this.props.index]["_id"]
      }`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          console.log(resJson);
          this.setState({ redirectRecurring: true });
        }
      })
      .catch((e) => console.log(e));
  };
  getExchangeRates = () => {
    let timeOut = setTimeout(() => alert("Slow Network Connectivity"), 6000);
    fetch(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=INR,USD,EUR,GBP,AUD,CNY"
    )
      .then((res) => res.json())
      .then((resJson) => {
        clearTimeout(timeOut);
        //let installmentArr = this.props.arr[this.props.index].installmentArr;
        let installmentsChechBtn = [].concat(this.state.installmentsChechBtn);
        let brickObject = this.props.arr[this.props.index].brickObj;
        //let breakIndex;
        let currencyType = this.props.country == "India" ? "INR" : "USD";
        let money = this.props.arr[this.props.index]["amounts"][
          currencyType
        ][0];
        //let productTotalAmount = Number(this.props.arr[this.props.index]["amount"]);

        // brickObject = {
        //   "One Nrsimhadeva Tile": installmentArr,
        //   "Two Nrsimhadeva Tile": [1],
        //   "Three Nrsimhadeva Tile": [1],
        //   "Four Nrsimhadeva Tile": [1],
        //   "Five Nrsimhadeva Tile": [1]
        // };

        installmentsChechBtn = [
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ];

        let transactionFee = (
          this.props.arr[this.props.index]["transactionFee"][
            this.state.paymentMode
          ] * resJson.rates[this.state.totalPicker]
        ).toFixed(2);

        this.setState({
          money: (
            money /
            brickObject[`One ${this.props.arr[this.props.index].name}`][0]
          ).toFixed(2),
          installment:
            brickObject[`One ${this.props.arr[this.props.index].name}`][0],
          exchangeRate: resJson,
          transactionFee,
          installmentArr: brickObject,
          installmentsChechBtn,
        });
      })
      .catch((error) => console.log(error));
  };
  razorPay = () => {
    let amount;
    if (this.state.customAmountRadio) {
      amount = (
        Number(this.state.customAmount) +
        (this.state.checkBtn ? Number(transactionFee) : 0)
      ).toFixed(2);
    } else {
      amount = (
        Number(this.state.money) +
        (this.state.checkBtn ? Number(transactionFee) : 0)
      ).toFixed(2);
    }
    var options = {
      description: "TOVP",
      image: this.props.arr[this.props.index].imgs[1],
      // "https://cdn.tovp.org/wp-content/uploads/2013/01/fotovp-trans-noshadow.png",
      currency: this.state.totalPicker,
      key: razorpayKey,
      amount: (amount * 100 + 30).toFixed(2),
      name: this.props.arr[this.props.index].title,
      theme: { color: "#42AEC2" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        this.setState({
          paymentProcessing: true,
          statusBarColor: "rgb(249,183,77)",
          navBarColor: "rgb(246,166,36)",
          pending: false,
        });
        this.props.autoCaptureRazorPay(
          data.razorpay_payment_id,
          (amount * 100 + 30).toFixed(2)
        );
        this.onSuccess("razorpay", data.razorpay_payment_id);
      })
      .catch((error) => {
        // handle failure
        this.setState({
          paymentPopVisible: false,
          paymentCancelled: true,
          paymentProcessing: true,
          statusBarColor: "rgb(221,80,63)",
          navBarColor: "rgb(234,87,67)",
          pending: false,
        });
        this.postPending("razorPay", "Failed");
        Animated.spring(this.navBarAnimate, {
          toValue: 0,
        }).start();
      });
  };
  installmentsBtnPress = (index) => {
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
  onNavigationChange = (data) => {
    console.log("291", data);
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
        visible: false,
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
        pending: false,
      });
      this.postPending("paypal", "Failed");
      Animated.spring(this.navBarAnimate, {
        toValue: 0,
      }).start();
    } else {
      return;
    }
  };

  razorpayNavigationChange = (data) => {
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
        statusBarColor: "rgb(82,157,58)",
      });
      Animated.spring(this.buttonAnimate, {
        toValue: 1,
      }).start();
    } else if (data.title == "cancel") {
      this.setState({
        razorpayModal: false,
        paymentPopVisible: false,
        paymentCancelled: true,
        paymentProcessing: true,
        statusBarColor: "rgb(221,80,63)",
        navBarColor: "rgb(234,87,67)",
        pending: false,
      });
      Animated.spring(this.navBarAnimate, {
        toValue: 0,
      }).start();
    } else {
      return;
    }
  };
  // onSuccess = mode => {
  //   let transactionFee = this.props.arr[this.props.index].transactionFee;
  //   this.setState({ posted: 1, activityI: true });
  //   url = `${apiUrl}paypal`;

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
  //       email: this.props.email,
  //       itemName: this.props.arr[this.props.index].name,
  //       userId: this.props.userId,
  //       totalEmi: this.state.installment,
  //       amount: this.state.customAmountRadio
  //         ? Number(Number(this.state.customAmount).toFixed(2))
  //         : Number(
  //             (
  //               Number(
  //                 this.props.arr[this.props.index]["amounts"][
  //                   this.state.totalPicker
  //                 ]
  //               ) * this.state.numberOfBricksAmount
  //             ).toFixed(2)
  //           ),
  //       perMonthAmount: this.state.customAmountRadio
  //         ? Number(Number(this.state.customAmount).toFixed(2))
  //         : Number(Number(this.state.money).toFixed(2)),
  //       payInFull: this.state.customAmountRadio
  //         ? true
  //         : this.state.installment - 1 == 0
  //         ? true
  //         : false,
  //       paymentMode: mode,
  //       campaignFlag: this.props.campaingFlag,
  //       campaignId: this.props.campaignId,
  //       currencyType: this.state.totalPicker
  //     })
  //   })
  //     .then(res => {
  //       let data = res.json();
  //       let status = res.status;
  //       return Promise.all([status, data]);
  //     })
  //     .then(([status, data]) => {
  //       if (status == 200 || data.message == "error sending sms") {
  //         this.setState({
  //           paymentPopVisible: false,
  //           visible: false,
  //           paymentID: data.paymentId,
  //           date: data.date,
  //           paymentMethod: data.paymentMethod,
  //           transactionAmount: data.amount,
  //           receiptVisible: true,
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
  //     .catch(e => console.log(e));
  // };

  onSuccess = (mode, transactionId) => {
    this.setState({ posted: 1, activityI: true });
    this.props
      .paymentController({
        hasTransactionFee: this.state.checkBtn,
        transactionId: transactionId,
        paymentId: this.state.productPaymentId,
        offsetInHours: new Date().getTimezoneOffset() / 60,
        productId: this.props.arr[this.props.index]._id,
        email: this.props.email,
        itemName: this.props.arr[this.props.index].name,
        userId: this.props.userId,
        totalEmi: this.state.installment,
        amount: this.state.customAmountRadio
          ? Number(Number(this.state.customAmount).toFixed(2))
          : Number(
              (
                Number(
                  this.props.arr[this.props.index]["amounts"][
                    this.state.totalPicker
                  ]
                ) * this.state.numberOfBricksAmount
              ).toFixed(2)
            ),
        perMonthAmount: this.state.customAmountRadio
          ? Number(Number(this.state.customAmount).toFixed(2))
          : Number(Number(this.state.money).toFixed(2)),
        payInFull: this.state.customAmountRadio
          ? true
          : this.state.installment - 1 == 0
          ? true
          : false,
        paymentMode: mode,
        campaignFlag: this.props.campaingFlag,
        campaignId: this.props.campaignId,
        currencyType: this.state.totalPicker,
        count: this.state.numberOfBricksAmount,
      })
      .then((data) => {
        if (data) {
          this.setState({
            transactionId: transactionId,
            paymentPopVisible: false,
            visible: false,
            paymentID: data.paymentId,
            date: data.date,
            paymentMethod: data.paymentMethod,
            transactionAmount: data.amount,
            receiptVisible: true,
            posted: 0,
            activityI: false,
            paymentSuccess: true,
            navBarColor: "rgb(94,170,70)",
            statusBarColor: "rgb(82,157,58)",
          });
          Animated.spring(this.buttonAnimate, {
            toValue: 1,
          }).start();
        }
      });
  };
  postPending = (mode, payStatus) => {
    let transactionFee = this.props.arr[this.props.index].transactionFee;
    this.setState({ posted: 1, activityI: true, pending: true });
    fetch(`${apiUrl}pay/pending/${this.props.userId}`, {
      method: "POST",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offsetInHours: new Date().getTimezoneOffset() / 60,
        paymentId: this.state.productPaymentId
          ? this.state.productPaymentId
          : null,
        paymentName: this.props.arr[this.props.index].name,
        amount: this.state.customAmountRadio
          ? Number(this.state.customAmount).toFixed(2)
          : Number(this.state.money).toFixed(2),
        paymentMode: mode,
        currencyType: this.state.totalPicker,
        paymentStatus: payStatus,
      }),
    })
      .then((res) => {
        //console.log(res);
        let data = res.json();
        let status = res.status;
        return Promise.all([status, data]);
      })
      .then(([status, data]) => {
        //console.log(status, data);
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
      .catch((e) => console.log(e));
  };
  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        this.setState({
          country: resJson.country,
          city: resJson.city,
          userState: resJson.state,
          pinCode: resJson.pinCode,
          panNumber: resJson.panNo,
          address: resJson.address,
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    if (this.state.customAmountRadio) {
      transactionFee = this.state.customAmount
        ? (
            this.props.arr[this.props.index].transactionFee[
              this.state.paymentMode
            ] * Number(this.state.customAmount)
          ).toFixed(2)
        : null;
    } else {
      if (this.state.money) {
        transactionFee = (
          this.props.arr[this.props.index].transactionFee[
            this.state.paymentMode
          ] * Number(this.state.money)
        ).toFixed(2);
      }
    }
    let customAmountMinCheck, customAmountMaxCheck;
    //if (this.state.exchangeRate) {
    //let ex = this.state.exchangeRate["rates"][this.state.totalPicker];
    maxLimit = this.props.arr[this.props.index]["maxLimit"][
      this.state.totalPicker
    ]; //* ex;
    minLimit = this.props.arr[this.props.index]["minArr"][
      this.state.totalPicker
    ];
    customAmountMinCheck =
      Number(this.state.customAmount) < minLimit ? true : false;
    customAmountMaxCheck =
      Number(this.state.customAmount) > maxLimit ? true : false;
    //}
    let paypalMoney;
    if (this.state.customAmountRadio) {
      paypalMoney = (
        Number(this.state.customAmount) +
        (this.state.checkBtn ? Number(transactionFee) : 0)
      ).toFixed(2);
    } else if (this.state.money) {
      paypalMoney = (
        Number(this.state.money) +
        (this.state.checkBtn ? Number(transactionFee) : 0)
      ).toFixed(2);
    }

    const animatedNAvHeight = this.navBarAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1 * screenHeight, 0.3 * screenHeight],
    });

    const animatedDoneBtn = this.buttonAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 0],
    });
    return (
      <React.Fragment>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2",
            }}
          >
            <LinearGradient //...........................topContainer
              colors={["#42aec2", "#007e92"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5,
              }}
            ></LinearGradient>
          </View>
        ) : null}

        <StatusBar
          backgroundColor={this.state.statusBarColor}
          barStyle="light-content"
        />
        <Modal //...............Redirect to recurring tab
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
        </Modal>
        <Modal //....................PaymentProcessing
          visible={this.state.paymentProcessing}
          style={{ flex: 1 }}
          onRequestClose={() => {
            this.setState({
              paymentProcessing: false,
              paymentSuccess: false,
              statusBarColor: "#007e92",
              paymentCancelled: false,
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
                  backgroundColor: this.state.statusBarColor,
                }}
              ></View>
            ) : null}
            <Animated.View //..........................NavBar
              style={{
                width: "100%",
                height: animatedNAvHeight,
                backgroundColor: this.state.navBarColor,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("4%"),
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
                      alignItems: "center",
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
                      alignItems: "center",
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
                    fontSize: widthPercentageToDP("3.2%"),
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
                    paymentCancelled: false,
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
                  alignItems: "center",
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
                  alignItems: "center",
                }}
              >
                {this.state.paymentCancelled ? (
                  <Text
                    style={{
                      color: "rgb(210,85,62)",
                      fontFamily: "Montserrat-Regular",
                      fontSize: widthPercentageToDP("3.4%"),
                      textAlign: "center",
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
                        textAlign: "center",
                      }}
                    >
                      Your transaction is being processed.
                    </Text>
                    <Text
                      style={{
                        color: "rgb(246,166,36)",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.4%"),
                        textAlign: "center",
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
                alignSelf: "center",
              }}
            />
            <View //.....................ItemName
              style={{
                width: "100%",
                aspectRatio: 5 / 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                paddingLeft: 18,
              }}
            >
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Item Name
              </Text>
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-SemiBold",
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
                alignSelf: "center",
              }}
            />
            {this.state.paymentMode == "paypal" ? (
              <View //.....................Transaction Id
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  paddingLeft: 18,
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  Transaction Id
                </Text>
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold",
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
                backgroundColor: "rgb(238,238,238)",
              }}
            />
            <View //.....................PaymentTo
              style={{
                width: "100%",
                aspectRatio: 5 / 1.2,
                backgroundColor: "#fff",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View //................flex1
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  paddingLeft: 18,
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular",
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
                      fontFamily: "Montserrat-SemiBold",
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
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  Amount
                </Text>
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  {currencySymbol[this.state.totalPicker]}
                  {paypalMoney
                    ? (
                        paypalMoney -
                        (this.state.checkBtn ? Number(transactionFee) : 0)
                      ).toFixed(2)
                    : null}
                </Text>
              </View>
            </View>
            <View //.....................Seperator
              style={{
                width: "100%",
                height: 10,
                alignSelf: "center",
                backgroundColor: "rgb(238,238,238)",
              }}
            />
            <View //......................paymentMode
              style={{
                width: "100%",
                aspectRatio: 5 / 1.2,
                backgroundColor: "#fff",
                justifyContent: "space-evenly",
                paddingLeft: 18,
              }}
            >
              <Text
                style={{
                  color: "rgb(69,69,69)",
                  fontFamily: "Montserrat-Regular",
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
                    fontFamily: "Montserrat-SemiBold",
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
                  bottom: animatedDoneBtn,
                }}
                onPress={() => {
                  this.setState({
                    paymentProcessing: false,
                    paymentSuccess: false,
                    statusBarColor: "#007e92",
                    paymentCancelled: false,
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
                    fontSize: widthPercentageToDP("3.5%"),
                  }}
                >
                  Done
                </Text>
              </AnimateBtn>
            </View>
          </View>
        </Modal>
        <Modal //.................activitiI
          visible={false} //{this.state.activityI}
          transparent={true}
          style={{ flex: 1 }}
        >
          <View
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              color="#000"
              size={Platform.OS === "android" ? 18 : 1}
              visible={this.state.activityI}
            />
          </View>
        </Modal>
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
              backgroundColor: "rgba(0,0,0,0.3)",
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
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flex: 1.5,
                  justifyContent: "center",
                  alignItems: "center",
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
                    backgroundColor: "#fff",
                  }}
                >
                  <Image
                    source={require("../../src/warning.png")}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.4%"),
                  }}
                >
                  Sorry
                </Text>
                <Text
                  style={{
                    color: "#aaaaaa",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.2%"),
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
                    alignSelf: "center",
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
                    <Text style={styles.modalTxt2}>
                      {this.state.customAmountRadio
                        ? this.state.customAmount
                        : (
                            this.state.money *
                            (this.state.exchangeRate
                              ? this.state.exchangeRate["rates"][
                                  this.state.totalPicker
                                ]
                              : 0)
                          ).toFixed(2)}
                    </Text>
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
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#d75a4a",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                  }}
                  onPress={() => {
                    this.setState({ paymentCancelled: false });
                    Actions.pop();
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("5%"),
                      color: "#fff",
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
              backgroundColor: "rgba(0,0,0,0.3)",
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
                zIndex: 2,
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
              backgroundColor: "rgba(0,0,0,0.3)",
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
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flex: 1.5,
                  justifyContent: "center",
                  alignItems: "center",
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
                    backgroundColor: "#fff",
                  }}
                >
                  <Image
                    source={require("../../src/check.png")}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.4%"),
                  }}
                >
                  Thank You!
                </Text>
                <Text
                  style={{
                    color: "#aaaaaa",
                    fontFamily: "Montserrat-Regular",
                    fontSize: widthPercentageToDP("3.2%"),
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
                    alignSelf: "center",
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
                    <Text style={styles.modalTxt2}>
                      {this.state.transactionAmount}
                    </Text>
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
                      {this.state.paymentMethod}
                    </Text>
                  </View>
                  <View style={styles.modalV}>
                    <Text style={styles.modalTxt1}>PAYMENT ID</Text>
                    <Text
                      style={[
                        styles.modalTxt2,
                        { fontSize: widthPercentageToDP("3.1%") },
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
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#d75a4a",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                  }}
                  onPress={() => {
                    this.setState({ receiptVisible: false });
                    Actions.replace("donorAccount");
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("5%"),
                      color: "#fff",
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
              pending: false,
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
                          this.state.totalPicker == "CNY"
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
                    <input name="name" value="${
                      this.props.arr[this.props.index].title
                    }" id="name" />
                    <input name="currency" value="${
                      this.state.totalPicker == "INR" ||
                      this.state.totalPicker == "CNY"
                        ? "USD"
                        : this.state.totalPicker
                    }" id="currency" />
                    <input name="userId" value="${
                      this.props.userId
                    }" id="userId" />
                    <input name="count" value="${
                      this.state.numberOfBricksAmount
                    }" id="count" />
                    <input name="description" value="something" id="description" />
                  </form>
                </body>
              </html>
              `,
              }}
              onNavigationStateChange={this.onNavigationChange}
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
              pending: false,
            });
            //this.postPending("paypal", "Failed");
            Animated.spring(this.navBarAnimate, {
              toValue: 0,
            }).start();
          }}
        >
          <React.Fragment>
            {Platform.OS === "ios" ? (
              <View style={{ width: "100%", height: 12 }} />
            ) : null}
            <WebView
              source={{
                uri: this.state.razorpayModalURI,
              }}
              onNavigationStateChange={(data) =>
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
            backgroundColor: "white",
          }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient //...........................topContainer
            colors={["#42aec2", "#007e92"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
            }}
          >
            <ImageBackground
              source={require("../../src/tovp_bg_10.png")}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-start",
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
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1.8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: this.props.arr[this.props.index].imgs[0] }}
                    style={{
                      width: "95%",
                      height: "95%",
                      resizeMode: "contain",
                    }}
                  />
                </View>

                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 8,
                    paddingRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("3.5%"),
                      color: "white",
                      fontFamily: "Montserrat-Bold",
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
              height:
                screenHeight / 2 +
                180 +
                35 *
                  (this.state.installmentArr
                    ? this.state.installmentArr[this.state.numberOfBricks]
                        .length + 1
                    : 1),
              borderRadius: 10,
              alignSelf: "center",
              elevation: 10,
              marginTop: 10,
              borderWidth: 1,
              borderColor: "#42aec2",
              borderRadius: 8,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <View //............Picker
              style={{
                flex: 3.5,
                paddingtop: 18,
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                paddingLeft: LeftPadding,
              }}
            >
              <View //.............picker1
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                {this.state.customAmountRadio ? (
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Text>{this.state.priceToBrick} Bricks</Text>
                  </View>
                ) : Platform.OS === "android" ? (
                  <Picker
                    selectedValue={this.state.numberOfBricks}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      let arr = [].concat(this.state.installmentsChechBtn);
                      for (
                        let i = 0;
                        i < this.state.installmentsChechBtn.length;
                        i++
                      ) {
                        if (i == 0) {
                          arr[i] = true;
                        } else {
                          arr[i] = false;
                        }
                      }

                      if (this.state.installmentArr) {
                        this.setState({
                          numberOfBricks: itemValue,
                          numberOfBricksAmount: itemIndex + 1,
                          installmentsChechBtn: arr,
                          money:
                            (Number(
                              this.props.arr[this.props.index]["amounts"][
                                this.state.totalPicker
                              ]
                            ) *
                              (itemIndex + 1)) /
                            this.state.installmentArr[itemValue][0],
                          installment: this.state.installmentArr[itemValue][0],
                        });
                      }
                    }}
                  >
                    {this.numberOfBricks.map((item, index) => (
                      <Picker.Item
                        key={index.toString()}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                ) : (
                  <IOSPicker
                    mode="modal"
                    selectedValue={this.state.numberOfBricks}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      let arr = [].concat(this.state.installmentsChechBtn);
                      for (
                        i = 0;
                        i < this.state.installmentsChechBtn.length;
                        i++
                      ) {
                        if (i == 0) {
                          arr[i] = true;
                        } else {
                          arr[i] = false;
                        }
                      }
                      if (this.state.installmentArr) {
                        this.setState({
                          numberOfBricks: itemValue,
                          numberOfBricksAmount: itemIndex + 1,
                          installmentsChechBtn: arr,
                          money:
                            (Number(
                              this.props.arr[this.props.index]["amounts"][
                                this.state.totalPicker
                              ]
                            ) *
                              (itemIndex + 1)) /
                            this.state.installmentArr[itemValue][0],
                          installment: this.state.installmentArr[itemValue][0],
                        });
                      }
                    }}
                  >
                    {this.numberOfBricks.map((item, index) => (
                      <Picker.Item
                        key={index.toString()}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </IOSPicker>
                )}
              </View>
              <View // picker 2
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: 8,
                  justifyContent: "center",
                }}
              >
                {this.props.country == "India" ? (
                  <Text
                    style={{
                      paddingLeft: widthPercentageToDP("3.1%"),
                    }}
                  >
                    {this.state.totalPicker}
                  </Text>
                ) : Platform.OS === "android" ? (
                  <Picker
                    selectedValue={this.state.totalPicker}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({
                        totalPicker: itemValue,
                        money:
                          Number(
                            this.props.arr[this.props.index]["amounts"][
                              itemValue
                            ]
                          ) *
                          (this.state.numberOfBricksAmount /
                            this.state.installmentArr[
                              this.state.numberOfBricks
                            ][0]),
                        //     /
                        // this.state.installment
                        // installment: this.state.installmentArr[
                        //   this.state.numberOfBricks
                        // ][0]
                      });
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
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({
                        totalPicker: itemValue,
                        money:
                          Number(
                            this.props.arr[this.props.index]["amounts"][
                              itemValue
                            ]
                          ) *
                          (this.state.numberOfBricksAmount /
                            this.state.installmentArr[
                              this.state.numberOfBricks
                            ][0]),
                        //     /
                        // this.state.installment
                        // installment: this.state.installmentArr[
                        //   this.state.numberOfBricks
                        // ][0]
                      });
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
              <View //text/textInput
                style={{
                  height: heightPercentageToDP("7.8%"),
                  width: screenWidth - 120,
                  borderWidth: 1,
                  borderColor: "#42aec2",
                  borderRadius: 8,
                  padding: this.state.customAmountRadio ? 0 : 8,
                }}
              >
                {this.state.customAmountRadio ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <TextInput
                      style={{
                        height: "100%",
                        width: "80%",
                        fontSize: 16,
                        color: "#000",
                        paddingLeft: 10,
                      }}
                      value={this.state.customAmount}
                      onChangeText={(txt) => {
                        let priceToBrick;
                        if (this.state.customAmountRadio) {
                          priceToBrick =
                            Number(txt) /
                            Number(
                              (
                                this.state.money /
                                this.state.installmentArr[
                                  `One ${this.props.arr[this.props.index].name}`
                                ][0]
                              ).toFixed(2)
                            );
                        }
                        this.setState({
                          customAmount: txt,
                          priceToBrick: priceToBrick.toFixed(2),
                        });
                      }}
                      keyboardType="numeric"
                      placeholder="Enter Amount"
                    />
                    <View
                      style={{
                        height: "100%",
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "#000" }}>
                        {this.state.totalPicker}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: "80%",
                        fontSize: 16,
                        color: "#000",
                        paddingLeft: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: widthPercentageToDP("3.4%"),
                          color: "#454545",
                        }}
                      >
                        {this.state.money
                          ? Number(this.state.money).toFixed(2)
                          : null}
                      </Text>
                    </View>

                    <View
                      style={{
                        height: "100%",
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "#000" }}>
                        {this.state.totalPicker}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            {this.state.installmentArr
              ? this.state.installmentArr[this.state.numberOfBricks].map(
                  (item, index) => (
                    <View //.......................................Installment
                      key={index.toString()}
                      style={{
                        width: "100%",
                        height: 28,
                        marginBottom: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: LeftPadding,
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          //forloop
                          let arr = [].concat(this.state.installmentsChechBtn);
                          if (this.state.numberOfBricksAmount == 1) {
                            for (
                              i = 0;
                              i < this.state.installmentsChechBtn.length;
                              i++
                            ) {
                              if (i == index) {
                                arr[i] = true;
                              } else {
                                arr[i] = false;
                              }
                            }
                          } else {
                            arr[index] = true;
                          }
                          this.setState({
                            money: (
                              Number(
                                this.props.arr[this.props.index]["amounts"][
                                  this.state.totalPicker
                                ]
                              ) / item
                            ).toFixed(2),
                            installmentsChechBtn: arr,
                            installment: item,
                            customAmountRadio: false,
                          });
                        }}
                        style={{
                          height: 16,
                          width: 16,
                          borderRadius: 18,
                          borderWidth: 1,
                          borderColor: this.state.installmentsChechBtn[index]
                            ? "#42aec2"
                            : "grey",
                          backgroundColor: "#fff",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                      >
                        {this.state.installmentsChechBtn[index] ? (
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 10,
                              backgroundColor: "#42aec2",
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={{ fontSize: widthPercentageToDP("3.3%") }}>
                          {item} installments, Monthly for {item} months
                        </Text>
                      </View>
                    </View>
                  )
                )
              : null}
            {/* <View //................customAmount
              style={{
                flex: 0.5,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: LeftPadding
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  let arr = [].concat(this.state.installmentsChechBtn);
                  if (!this.state.customAmountRadio) {
                    for (
                      i = 0;
                      i < this.state.installmentsChechBtn.length;
                      i++
                    ) {
                      arr[i] = false;
                    }
                  }

                  this.setState({
                    customAmountRadio: !this.state.customAmountRadio,
                    installmentsChechBtn: arr
                  });
                }}
                style={{
                  height: 15,
                  width: 15,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: this.state.customAmountRadio
                    ? "#42aec2"
                    : "grey",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10
                }}
              >
                {this.state.customAmountRadio ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 9,
                      backgroundColor: "#42aec2"
                    }}
                  />
                ) : null}
              </TouchableOpacity>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontSize: widthPercentageToDP("3.2%") }}>
                  Give a Custom Amount
                </Text>
              </View>
            </View> */}
            <View //................error
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: LeftPadding,
              }}
            >
              {this.state.customAmountRadio ? (
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.3%"),
                    color: "#d2553e",
                  }}
                >
                  {Number(this.state.customAmount) < minLimit
                    ? `The minimum custom donation amount for this form is ${
                        currencySymbol[this.state.totalPicker]
                      } ${minLimit.toFixed(2)}`
                    : null}
                  {Number(this.state.customAmount) > maxLimit
                    ? `The maximum custom donation amount for this form is ${
                        currencySymbol[this.state.totalPicker]
                      } ${maxLimit.toFixed(2)} `
                    : null}
                </Text>
              ) : null}
              {!this.state.customAmountRadio ? (
                this.state.installment == 1 ? (
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP("3.3%"),
                      color: "#008000",
                    }}
                  >
                    {this.props.arr[this.props.index].name} pay in full
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP("3.3%"),
                      color: "#008000",
                    }}
                  >
                    {this.state.installment} installments, Monthly for{" "}
                    {this.state.installment} months
                  </Text>
                )
              ) : null}
            </View>
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
                backgroundColor: "#c0d8fe",
              }}
            >
              <Image
                source={require("../../src/idea_1.png")}
                style={{ width: 10, height: 10, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.2%"),
                  fontFamily: "Montserrat-Regular",
                }}
              >
                {" "}
                If you want to donate by cheque you can directly contact TOVP
                office
              </Text>
            </View>
            {/* <View //..............radiobtn
              style={{
                flex: 0.5,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: LeftPadding,
                paddingTop: 10,
                paddingRight: 18
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
                  {this.state.totalPicker} {transactionFee} for my donation.
                </Text>
              </View>
            </View> */}
            <View //.................Terms
              style={{
                flex: 0.8,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: LeftPadding,
                justifyContent: "flex-start",
                alignItems: "flex-end",
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
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: "#42aec2",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.4%"),
                  }}
                >
                  Show Terms
                </Text>
              </TouchableOpacity>
            </View>
            <View //......................donatebtn
              style={{
                width: "100%",
                aspectRatio: 5 / 1.5,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 20,
              }}
            >
              {this.state.agree ? (
                <TouchableOpacity
                  onPress={() => {
                    if (Number(this.state.money)) {
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
                            let url = `${apiUrl}paypal?email=${
                              this.props.email
                            }&itemName=${
                              this.props.arr[this.props.index].name
                            }&totalEmi=${this.state.installment}&amount=${
                              this.state.customAmountRadio
                                ? Number(
                                    Number(this.state.customAmount).toFixed(2)
                                  )
                                : Number(
                                    (
                                      Number(
                                        this.props.arr[this.props.index][
                                          "amounts"
                                        ][this.state.totalPicker]
                                      ) * this.state.numberOfBricksAmount
                                    ).toFixed(2)
                                  )
                            }&perMonthAmount=${
                              this.state.customAmountRadio
                                ? Number(
                                    Number(this.state.customAmount).toFixed(2)
                                  )
                                : Number(Number(this.state.money).toFixed(2))
                            }&transactionAmount=${
                              this.state.exchangeRate
                                ? this.state.totalPicker == "INR" ||
                                  this.state.totalPicker == "CNY"
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
                            }&campaignFlag=${
                              this.props.campaingFlag
                            }&campaignId=${
                              this.props.campaignId
                            }&paypalCurrency=${
                              this.state.totalPicker == "INR" ||
                              this.state.totalPicker == "CNY"
                                ? "USD"
                                : this.state.totalPicker
                            }&currencyType=${
                              this.state.totalPicker
                            }&productId=${
                              this.props.arr[this.props.index]._id
                            }&userId=${this.props.userId}&imgURL=${
                              this.props.arr[this.props.index].imgs[1]
                            }&offsetInHours=${
                              new Date().getTimezoneOffset() / 60
                            }&payInFull=${
                              this.state.customAmountRadio
                                ? true
                                : this.state.installment - 1 == 0
                                ? true
                                : false
                            }&hasTransactionFee=${
                              this.state.checkBtn ? 1 : 0
                            }&count=${this.state.numberOfBricksAmount}`;
                            console.log(url);
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.postPending("paypal", "Pending");
                            //this.setState({ visible: true });
                          }
                        } else if (this.state.paymentMode == "razorPay") {
                          //if (Platform.OS == "ios") {
                          let amount;
                          if (this.state.customAmountRadio) {
                            amount = (
                              Number(this.state.customAmount) +
                              (this.state.checkBtn ? Number(transactionFee) : 0)
                            ).toFixed(2);
                          } else {
                            amount = (
                              Number(this.state.money) +
                              (this.state.checkBtn ? Number(transactionFee) : 0)
                            ).toFixed(2);
                          }
                          let url = `${apiUrl}razorpay/browser?email=${
                            this.props.email
                          }&itemName=${
                            this.props.arr[this.props.index].name
                          }&totalEmi=${this.state.installment}&amount=${
                            this.state.customAmountRadio
                              ? Number(
                                  Number(this.state.customAmount).toFixed(2)
                                )
                              : Number(
                                  (
                                    Number(
                                      this.props.arr[this.props.index][
                                        "amounts"
                                      ][this.state.totalPicker]
                                    ) * this.state.numberOfBricksAmount
                                  ).toFixed(2)
                                )
                          }&perMonthAmount=${
                            this.state.customAmountRadio
                              ? Number(
                                  Number(this.state.customAmount).toFixed(2)
                                )
                              : Number(Number(this.state.money).toFixed(2))
                          }&transactionAmount=${amount}&campaignFlag=${
                            this.props.campaingFlag
                          }&campaignId=${this.props.campaignId}&currencyType=${
                            this.state.totalPicker
                          }&productId=${
                            this.props.arr[this.props.index]._id
                          }&userId=${this.props.userId}&imgURL=${
                            this.props.arr[this.props.index].imgs[1]
                          }&offsetInHours=${
                            new Date().getTimezoneOffset() / 60
                          }&payInFull=${
                            this.state.customAmountRadio
                              ? true
                              : this.state.installment - 1 == 0
                              ? true
                              : false
                          }&hasTransactionFee=${
                            this.state.checkBtn ? 1 : 0
                          }&count=${this.state.numberOfBricksAmount}`;
                          console.log(url);
                          if (Platform.OS == "ios") {
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.setState({
                              razorpayModal: true,
                              razorpayModalURI: url,
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
                      !this.state.pending &&
                      !(
                        (customAmountMinCheck || customAmountMaxCheck) &&
                        this.state.customAmountRadio
                      ) &&
                      this.state.money != "0.00"
                        ? "#42aec2"
                        : "#dfdfdf",
                  }}
                  disabled={
                    ((customAmountMinCheck || customAmountMaxCheck) &&
                      this.state.customAmountRadio) ||
                    this.state.pending ||
                    this.state.money == "0.00"
                  }
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color:
                        !this.state.pending &&
                        !(
                          (customAmountMinCheck || customAmountMaxCheck) &&
                          this.state.customAmountRadio
                        ) &&
                        this.state.money != "0.00"
                          ? "#deffffff"
                          : "#9f9f9f",
                    }}
                  >
                    Donate
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
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#42aec2",
                      fontSize: 14,
                      fontFamily: "Montserrat-SemiBold",
                    }}
                  >
                    Agree
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View //..................note
            style={[styles.noteStyle, { backgroundColor: "#dff0d8" }]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#3c763d",
              }}
            >
              REMINDER: We request you to please complete your pledge payments
              by 2022 to insure our financial solvency for completing the TOVP
              on time. Thus, kindly consider making your payment in full or
              selecting a larger recurring payment to help us meet our urgently
              needed monthly budget. Thank you.
            </Text>
          </View>
          <View //..................note
            style={[styles.noteStyle, { backgroundColor: "#f2dede" }]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#a94442",
              }}
            >
              The below payment options are all set up for auto-withdrawal
              through recurring payments towards your pledge. If you prefer to
              make payments in your own time-frame, use the General Donations
              option and indicate this in the Notes section of the donation form
              along with the option you are donating for (Brick, Coin, etc.)
              each time you make a payment. If you prefer to make your pledge
              payments by check or bank transfer, go to the Donation
              Details/Contacts page and scroll down to your country for the
              check mailing address and bank transfer information. Note that if
              you are using this individual payment method you will have to
              remember to make your regular payments as you will not be on our
              auto-pay system. Your timely payments will be very much
              appreciated.
            </Text>
          </View>
          <View //..................note
            style={[
              styles.noteStyle,
              {
                backgroundColor: "#fcf8e3",
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#8d703f",
              }}
            >
              ATTENTION: Please select your currency before proceeding with your
              contribution!
            </Text>
          </View>
          <View //..................note
            style={[
              styles.noteStyle,
              {
                backgroundColor: "#d9edf7",
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.4%"),
                color: "#31708f",
              }}
            >
              PAYMENTS BY CHECK AND WIRE TRANSFER : To make payments by check go
              ​to Donation Details page. To make payments by bank wire transfer
              ​​go to Bank Transfer Details page.
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
    justifyContent: "space-evenly",
  },
  txt1: { fontSize: 10, color: "#42aec2", fontFamily: "Montserrat-SemiBold" },
  txtTitle: {
    fontSize: widthPercentageToDP("3.3%"),
    color: "#3e3b3b",
    fontFamily: "Montserrat-Bold",
  },
  modalTxt1: {
    color: "#aaaaaa",
    fontFamily: "Montserrat-Regular",
    fontSize: widthPercentageToDP("3.2%"),
  },
  modalTxt2: {
    color: "#454545",
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.4%"),
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
    marginTop: widthPercentageToDP("3.5%"),
  },
});
