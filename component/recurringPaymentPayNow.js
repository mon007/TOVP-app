import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  Platform,
  Animated,
  StatusBar,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import moment from "moment";
import NavBar from "./navBar";
import Icon from "react-native-vector-icons/dist/Feather";
import NetInfo from "@react-native-community/netinfo";
import { WebView } from "react-native-webview";
import RazorpayCheckout from "react-native-razorpay";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";
import { apiUrl, paypalApiUrl, razorpayKey } from "./config";

let transactionFee;
let prevProductId;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const LeftPadding = 120 / 2 - (screenWidth - 0.9 * screenWidth) / 2;
const currencyArr = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};
const AnimateBtn = Animated.createAnimatedComponent(TouchableOpacity);
export default class PayNow extends React.Component {
  constructor(props) {
    super(props);
    this.navBarAnimate = new Animated.Value(1);
    this.buttonAnimate = new Animated.Value(0);
  }
  state = {
    data: null,
    transactionFeeModal: false,
    paymentPopVisible: false,
    emiId: "",
    money: "",
    visible: "",
    index: null,
    posted: 0,
    exchangeRate: null,
    transactionFee: null,
    paymentCancelled: false,
    paymentMethod: "",
    activityI: false,
    productPaymentId: "",
    paymentProcessing: false,
    statusBarColor: "#007e92",
    navBarColor: "rgb(246,166,36)",
    paymentSuccess: false,
    pending: false,
    itemAmount: "",
    itemId: "",
    checkBtn: false,
    razorpayModal: false,
    razorpayModalURI: "",
  };
  componentDidMount() {
    console.log(this.props.item);
    BackHandler.addEventListener("hardwareBackPress", () => {
      Actions.popAndPush("donorAccount");
      this.props.getOverdueData(false);
    });
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.getAllEmiDetails();
        this.getExchangeRates();
        this.getProductDetails();
      } else {
        alert("Network error");
      }
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => {
      Actions.popAndPush("donorAccount");
      this.props.getOverdueData(false);
    });
    NetInfo.removeEventListener();
  }
  getExchangeRates = () => {
    fetch(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=INR,USD,EUR,GBP,AUD,CNY"
    )
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          exchangeRate: resJson,
        });
      })
      .catch((error) => console.log(error));
  };
  getAllEmiDetails = () => {
    // console.log(apiUrl, this.props.item.emiId);
    let url =
      apiUrl + "user/donor-account/emi-details/" + this.props.item.emiId;
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        // console.log(resJson);
        let sortedArr = resJson.sort((a, b) => a.emiNumber - b.emiNumber);
        console.log("sortedRecurring", sortedArr);
        let arr = [].concat(JSON.parse(JSON.stringify(sortedArr)));
        const date = moment(
          moment(new Date()).format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ).valueOf();
        const dateAhead = moment(
          moment(Date.now()).add(32, "day").format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ).valueOf();

        for (i = 0; i < arr.length; i++) {
          if (arr[i].dueDate < date && arr[i].status != "paid") {
            arr[i].status = "payNow";
          } else if (arr[i].status == "paid") {
            arr[i].status = "paid";
          } else if (arr[i].dueDate > date) {
            if (
              arr[i].dueDate < dateAhead &&
              arr[i].dueDate > date &&
              arr[i].status == "unpaid"
            ) {
              arr[i].status = "payNow";
            } else {
              arr[i].status = "unavailable";
            }
          }
        }
        console.log(arr);
        this.setState({ data: arr });
      })
      .catch((e) => console.log(e));
  };
  getProductDetails = () => {
    fetch(`${apiUrl}products/all`, {
      method: "GET",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        let sortedArr = resJson.sort((a, b) => a.order - b.order);
        for (i = 0; i < sortedArr.length; i++) {
          if (sortedArr[i].name == this.props.item.paymentName) {
            this.setState({ transactionFee: sortedArr[i].transactionFee });
            break;
          }
        }
      })
      .catch((e) => console.log(e));
  };
  razorPay = () => {
    var options = {
      description: "TOVP",
      image: this.props.item.imgs[1],
      // "https://cdn.tovp.org/wp-content/uploads/2013/01/fotovp-trans-noshadow.png",
      currency: this.props.item.currencyType,
      key: razorpayKey,
      amount: (
        (
          Number(this.state.data[0].amount) +
          (this.state.checkBtn ? Number(transactionFee) : 0)
        ).toFixed(2) *
          100 +
        30
      ).toFixed(2),
      name: this.props.item.paymentName,
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
          transactionFeeModal: false,
        });
        this.props.autoCaptureRazorPay(
          data.razorpay_payment_id,
          (
            (
              Number(this.state.data[0].amount) +
              (this.state.checkBtn ? Number(transactionFee) : 0)
            ).toFixed(2) *
              100 +
            30
          ).toFixed(2)
        );
        this.onSuccess("razorpay", data.razorpay_payment_id);
      })
      .catch((error) => {
        // handle failure
        console.log(error);
        this.setState({
          paymentPopVisible: false,
          paymentCancelled: true,
          paymentProcessing: true,
          statusBarColor: "rgb(221,80,63)",
          navBarColor: "rgb(234,87,67)",
          pending: false,
          transactionFeeModal: false,
        });
        this.pendingPay(this.state.emiId, "Failed", false);
        Animated.spring(this.navBarAnimate, {
          toValue: 0,
        }).start();
        //alert(`Error: ${error.description}`);
      });
  };
  onNavigationChange = (data) => {
    console.log("onNavigationChange", data);
    if (data.title == "success") {
      let url = data.url;
      let pair = [];
      let vars = url.split("&");
      for (i = 0; i < vars.length; i++) {
        pair[i] = vars[i].split("=");
      }
      let transactionId = pair[3][1];
      this.setState({
        paymentProcessing: true,
        statusBarColor: "rgb(249,183,77)",
        navBarColor: "rgb(246,166,36)",
        pending: false,
        transactionFeeModal: false,
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
        transactionFeeModal: false,
      });
      this.pendingPay(this.state.emiId, "Failed", false);
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
      let data = [].concat(this.state.data);
      data[this.state.index].status = "paid";
      this.setState({
        data,
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
  //   this.setState({ posted: 1, activityI: true });
  //   url =
  //     apiUrl +
  //     "pay/" +
  //     this.state.emiId +
  //     "?paymentMethod=" +
  //     mode +
  //     "&offsetInHours=" +
  //     new Date().getTimezoneOffset() / 60 +
  //     "&paymentId=" +
  //     this.state.productPaymentId;
  //   fetch(url)
  //     .then(res => {
  //       // console.log(res);
  //       const statusCode = res.status;
  //       const data = res.json();
  //       return Promise.all([statusCode, data]);
  //     })
  //     .then(([status, data]) => {
  //       // console.log(status, data);
  //       if (status == 200 || data.message == "error sending sms") {
  //         let data = [].concat(this.state.data);
  //         data[this.state.index].status = "paid";
  //         this.setState({
  //           data,
  //           visible: false,
  //           paymentPopVisible: false,
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
  //       // console.log(e);
  //       this.setState({ visible: false, activityI: false });
  //       alert(e);
  //     });
  // };
  onSuccess = (mode, transactionId) => {
    this.setState({ posted: 1, activityI: true });
    let url =
      apiUrl +
      "pay/" +
      this.state.emiId +
      "?paymentMethod=" +
      mode +
      "&offsetInHours=" +
      new Date().getTimezoneOffset() / 60 +
      "&paymentId=" +
      this.state.productPaymentId +
      "&transactionId=" +
      transactionId +
      "&hasTransactionFee=" +
      this.state.checkBtn;
    this.props.recurringPaymentController(url).then((res) => {
      if (res) {
        let data = [].concat(this.state.data);
        data[this.state.index].status = "paid";
        this.setState({
          data,
          visible: false,
          paymentPopVisible: false,
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
  pendingPay = (productEmiId, payStatus, pendingBool) => {
    let item = this.props.item;
    let url = (url = apiUrl + "pay/pending/" + this.props.userId);
    this.setState({ pending: pendingBool, transactionFeeModal: false });
    // console.log({
    //   paymentId: this.state.productPaymentId
    //     ? this.state.productPaymentId
    //     : null,
    //   offsetInHours: new Date().getTimezoneOffset() / 60,
    //   paymentName: item.paymentName,
    //   paymentMode: this.props.country == "India" ? "razorPay" : "paypal",
    //   amount: (item.amount / item.totalEmi).toFixed(2),
    //   currencyType: item.currencyType,
    //   paymentStatus: payStatus
    // });
    fetch(url, {
      method: "POST",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: this.state.productPaymentId
          ? this.state.productPaymentId
          : null,
        offsetInHours: new Date().getTimezoneOffset() / 60,
        paymentName: item.paymentName,
        paymentMode: this.props.country == "India" ? "razorPay" : "paypal",
        amount: (item.amount / item.totalEmi).toFixed(2),
        currencyType: item.currencyType,
        paymentStatus: payStatus,
      }),
    })
      .then((res) => {
        let data = res.json();
        let status = res.status;
        return Promise.all([status, data]);
      })
      .then(([status, data]) => {
        //console.log(status, data, this.props.item.emiId);
        if (status == 200) {
          if (data) {
            prevProductId = data;
          }
          this.setState({ productPaymentId: data });
          if (this.props.country == "India" && payStatus == "Pending") {
            this.razorPay();
          } else if (payStatus == "Pending") {
            this.setState({
              visible: true,
            });
          }
        } else {
          alert("Something went wrong");
        }
      })
      .catch((e) => console.log(e));
  };
  renderItemView = ({ item, index }) => {
    return (
      <View
        style={{
          width: "90%",
          height: 70,
          backgroundColor: "#fff",
          alignSelf: "center",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingLeft: 18 }}>
          <Text
            style={{
              color: "#515555",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Emi Number: {item.emiNumber}
          </Text>
          <Text
            style={{
              color: "#8b8b8b",
              fontFamily: "Montserrat-Regular",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Due Date : {moment(item.dueDate).format("DD.MM.YYYY")}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: 10,
          }}
        >
          {item.status == "payNow" ? (
            <TouchableOpacity
              style={{
                height: 30,
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: this.state.pending ? "#dfdfdf" : "#008000",
                borderRadius: 4,
              }}
              disabled={this.state.pending}
              // onPress={() => {
              //   this.setState({
              //     transactionFeeModal: true,
              //     money: item.amount.toFixed(2),
              //     emiId: item._id,
              //     index
              //   });
              // }}
              onPress={() => {
                this.setState(
                  {
                    //transactionFeeModal: true,
                    money: item.amount.toFixed(2),
                    emiId: item._id,
                    index,
                  },
                  () => {
                    NetInfo.addEventListener((state) => {
                      if (
                        this.state.data &&
                        this.props.country == "India" &&
                        this.state.transactionFee
                      ) {
                        transactionFee = (
                          this.state.transactionFee.razorPay *
                          this.state.data[0].amount
                        ).toFixed(2);
                      } else if (this.state.data && this.state.transactionFee) {
                        transactionFee = (
                          this.state.transactionFee.paypal *
                          this.state.data[0].amount
                        ).toFixed(2);
                      } else {
                        transactionFee = 0;
                      }
                      const item = this.props.item;
                      if (state.isConnected) {
                        if (this.props.country == "India") {
                          //if (Platform.OS == "ios") {
                          let url = `${apiUrl}razorpay/browser/recuring?itemName=${
                            item.paymentName
                          }&perMonthAmount=${Number(
                            this.state.data[0].amount
                          )}&transactionAmount=${(
                            Number(this.state.data[0].amount) +
                            (this.state.checkBtn ? Number(transactionFee) : 0)
                          ).toFixed(2)}&imgURL=${
                            this.props.item.imgs[1]
                          }&offsetInHours=${
                            new Date().getTimezoneOffset() / 60
                          }&id=${this.state.emiId}&currency=${
                            this.props.item.currencyType
                          }&hasTransactionFee=${this.state.checkBtn ? 1 : 0}`;
                          console.log("yuuu", url);
                          this.setState({ transactionFeeModal: false });
                          if (Platform.OS == "ios") {
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.setState({
                              razorpayModal: true,
                              razorpayModalURI: url,
                            });
                            //this.pendingPay(this.state.emiId, "Pending", true);
                            //this.setState({ visible: true });
                          }
                        } else {
                          if (Platform.OS == "ios") {
                            let url = `${apiUrl}paypal/pay/browser?itemName=${
                              item.paymentName
                            }&perMonthAmount=${
                              this.state.exchangeRate &&
                              this.state.data &&
                              this.state.transactionFee
                                ? item.currencyType == "INR" ||
                                  item.currencyType == "CNY"
                                  ? Number(
                                      (
                                        Number(this.state.data[0].amount) /
                                        this.state.exchangeRate["rates"][
                                          item.currencyType
                                        ]
                                      ).toFixed(2)
                                    )
                                  : Number(
                                      Number(this.state.data[0].amount).toFixed(
                                        2
                                      )
                                    )
                                : 0
                            }&transactionAmount=${
                              this.state.exchangeRate &&
                              this.state.data &&
                              this.state.transactionFee
                                ? item.currencyType == "INR" ||
                                  item.currencyType == "CNY"
                                  ? Number(
                                      (
                                        Number(
                                          this.state.data[0].amount +
                                            (this.state.checkBtn
                                              ? Number(transactionFee)
                                              : 0)
                                        ) /
                                        this.state.exchangeRate["rates"][
                                          item.currencyType
                                        ]
                                      ).toFixed(2)
                                    )
                                  : Number(
                                      Number(
                                        this.state.data[0].amount +
                                          (this.state.checkBtn
                                            ? Number(transactionFee)
                                            : 0)
                                      ).toFixed(2)
                                    )
                                : 0
                            }&imgURL=${this.props.item.imgs[1]}&offsetInHours=${
                              new Date().getTimezoneOffset() / 60
                            }&id=${this.state.emiId}&paypalCurrency=${
                              item.currencyType == "INR" ||
                              item.currencyType == "CNY"
                                ? "USD"
                                : this.props.item.currencyType
                            }&currency=${
                              this.props.item.currencyType
                            }&hasTransactionFee=${this.state.checkBtn ? 1 : 0}`;
                            console.log("yu", url);
                            this.setState({ transactionFeeModal: false });
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.pendingPay(this.state.emiId, "Pending", true);
                            //this.razorPay();
                          }
                        }
                      } else {
                        alert("Network error");
                      }
                    });
                  }
                );
              }}
            >
              <Text
                style={{
                  color: this.state.pending ? "#9f9f9f" : "#fff",
                  fontSize: widthPercentageToDP(3),
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                Pay Now >
              </Text>
            </TouchableOpacity>
          ) : item.status == "payNow" ? (
            <Text
              style={{
                color: "#42aec2",
                fontSize: widthPercentageToDP(3),
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              {item.status}
            </Text>
          ) : (
            <Text
              style={{
                color: "#cccccc",
                fontSize: widthPercentageToDP(3),
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              {item.status}
            </Text>
          )}
        </View>
      </View>
    );
  };
  render() {
    if (
      this.state.data &&
      this.props.country == "India" &&
      this.state.transactionFee
    ) {
      transactionFee = (
        this.state.transactionFee.razorPay * this.state.data[0].amount
      ).toFixed(2);
    } else if (this.state.data && this.state.transactionFee) {
      transactionFee = (
        this.state.transactionFee.paypal * this.state.data[0].amount
      ).toFixed(2);
    } else {
      transactionFee = 0;
    }
    const item = this.props.item;
    console.log("aya", item);

    const animatedNAvHeight = this.navBarAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1 * screenHeight, 0.3 * screenHeight],
    });

    const animatedDoneBtn = this.buttonAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 0],
    });
    return (
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2",
            }}
          ></View>
        ) : null}

        <StatusBar
          backgroundColor={this.state.statusBarColor}
          barStyle="light-content"
        />
        <Modal //....................transactionFee
          visible={this.state.transactionFeeModal}
          style={{ flex: 1 }}
          transparent={true}
          onRequestClose={() => {
            this.setState({ transactionFeeModal: false });
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            // onPress={() => {
            //   this.setState({ transactionFeeModal: false });
            // }}
          >
            <View
              style={{
                width: screenWidth - 20,
                height: 150,
                backgroundColor: "#fff",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "rgb(215,90,74)",
                  width: 20,
                  height: 20,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: -4,
                  right: -4,
                }}
                onPress={() => {
                  this.setState({ transactionFeeModal: false });
                }}
              >
                <Icon color="#fff" size={10} name="x" />
              </TouchableOpacity>
              <View //..............radiobtn
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 10,
                  //paddingRight: 18,
                  paddingTop: 10,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      checkBtn: !this.state.checkBtn,
                    });
                  }}
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor: this.state.checkBtn ? "#008000" : "grey",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  {this.state.checkBtn ? (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: "#008000",
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("3.2%"),
                      fontFamily: "Montserrat-SemiBold",
                      color: "#454545",
                    }}
                  >
                    I'd like to help cover the transaction fees of{" "}
                    {item.currencyType} {Number(transactionFee).toFixed(2)} for
                    my donation.
                  </Text>
                </View>
              </View>
              <View //btn
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 100,
                    elevation: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: this.state.pending ? "#dfdfdf" : "#008000",
                    borderRadius: 4,
                  }}
                  disabled={this.state.pending}
                  onPress={() => {
                    NetInfo.addEventListener((state) => {
                      if (state.isConnected) {
                        if (this.props.country == "India") {
                          if (Platform.OS == "ios") {
                            let url = `${apiUrl}razorpay/browser/recuring?itemName=${
                              item.paymentName
                            }&perMonthAmount=${Number(
                              this.state.data[0].amount
                            )}&transactionAmount=${(
                              Number(this.state.data[0].amount) +
                              (this.state.checkBtn ? Number(transactionFee) : 0)
                            ).toFixed(2)}&imgURL=${
                              this.props.item.imgs[1]
                            }&offsetInHours=${
                              new Date().getTimezoneOffset() / 60
                            }&id=${this.state.emiId}&currency=${
                              this.props.item.currencyType
                            }&hasTransactionFee=${this.state.checkBtn ? 1 : 0}`;
                            console.log("yuuu", url);
                            this.setState({ transactionFeeModal: false });
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.pendingPay(this.state.emiId, "Pending", true);
                            //this.setState({ visible: true });
                          }
                        } else {
                          if (Platform.OS == "ios") {
                            let url = `${apiUrl}paypal/pay/browser?itemName=${
                              item.paymentName
                            }&perMonthAmount=${
                              this.state.exchangeRate &&
                              this.state.data &&
                              this.state.transactionFee
                                ? item.currencyType == "INR" ||
                                  item.currencyType == "CNY"
                                  ? Number(
                                      (
                                        Number(this.state.data[0].amount) /
                                        this.state.exchangeRate["rates"][
                                          item.currencyType
                                        ]
                                      ).toFixed(2)
                                    )
                                  : Number(
                                      Number(this.state.data[0].amount).toFixed(
                                        2
                                      )
                                    )
                                : 0
                            }&transactionAmount=${
                              this.state.exchangeRate &&
                              this.state.data &&
                              this.state.transactionFee
                                ? item.currencyType == "INR" ||
                                  item.currencyType == "CNY"
                                  ? Number(
                                      (
                                        Number(
                                          this.state.data[0].amount +
                                            (this.state.checkBtn
                                              ? Number(transactionFee)
                                              : 0)
                                        ) /
                                        this.state.exchangeRate["rates"][
                                          item.currencyType
                                        ]
                                      ).toFixed(2)
                                    )
                                  : Number(
                                      Number(
                                        this.state.data[0].amount +
                                          (this.state.checkBtn
                                            ? Number(transactionFee)
                                            : 0)
                                      ).toFixed(2)
                                    )
                                : 0
                            }&imgURL=${this.props.item.imgs[1]}&offsetInHours=${
                              new Date().getTimezoneOffset() / 60
                            }&id=${this.state.emiId}&paypalCurrency=${
                              item.currencyType == "INR" ||
                              item.currencyType == "CNY"
                                ? "USD"
                                : this.props.item.currencyType
                            }&currency=${
                              this.props.item.currencyType
                            }&hasTransactionFee=${this.state.checkBtn ? 1 : 0}`;
                            console.log("yu", url);
                            this.setState({ transactionFeeModal: false });
                            Linking.openURL(url).catch((err) =>
                              console.error("An error occurred", err)
                            );
                          } else {
                            this.pendingPay(this.state.emiId, "Pending", true);
                            //this.razorPay();
                          }
                        }
                      } else {
                        alert("Network error");
                      }
                    });
                  }}
                >
                  <Text
                    style={{
                      color: this.state.pending ? "#9f9f9f" : "#fff",
                      fontSize: 12,
                      fontFamily: "Montserrat-SemiBold",
                    }}
                  >
                    Pay Now >
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
                      source={require("../src/success1.png")}
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
                      source={require("../src/Clock-Widget.gif")}
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
                  console.log("fdddd");
                  this.setState({
                    paymentProcessing: false,
                    paymentSuccess: false,
                    statusBarColor: "#007e92",
                    paymentCancelled: false,
                  });
                  this.navBarAnimate.setValue(0);
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
                {item.paymentName}
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
            {this.props.country != "India" ? (
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
                    source={require("../src/applogo.png")}
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
                  {this.state.data
                    ? currencyArr[item.currencyType] +
                      " " +
                      this.state.data[0].amount.toFixed(2)
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
                {this.props.country == "India" ? (
                  <Image
                    source={require("../src/razorPay.png")}
                    style={{ width: 40, height: 25, resizeMode: "contain" }}
                  />
                ) : (
                  <Image
                    source={require("../src/paypal.png")}
                    style={{ width: 40, height: 25, resizeMode: "contain" }}
                  />
                )}
                <Text
                  style={{
                    color: "rgb(69,69,69)",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  {this.props.country == "India" ? "razorPay" : "paypal"}
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
        <Modal
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
                    source={require("../src/warning.png")}
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
                      {this.state.data ? this.state.data[0].amount : 0}
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
        <Modal //...............Payment popUp
          visible={false} //{this.state.paymentPopVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({ paymentPopVisible: false });
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
            onPress={() => this.setState({ paymentPopVisible: false })}
          >
            <TouchableOpacity
              onStartShouldSetResponder={() => true}
              style={{
                backgroundColor: "white",
                width: "90%",
                height: screenHeight / 2 + 100,
                borderRadius: 10,
                zIndex: 2,
                padding: 18,
                borderWidth: 0.5,
                borderColor: "#42aec2",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 18,
                  }}
                >
                  Emi Amount :
                </Text>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 15,
                  }}
                >
                  {currencyArr[item.currencyType] + " " + this.state.money}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 15,
                  }}
                >
                  Transaction fee will be applicaple on the amount above.
                </Text>
              </View>

              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 18,
                  }}
                >
                  Payment Modes
                </Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-evenly",
                    alignItems: "flex-start",
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
                      elevation: 10,
                    }}
                    onPress={() => this.setState({ visible: true })}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../src/paypal.png")}
                        style={{ width: 30, height: 30, resizeMode: "contain" }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "#454545",
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: 14,
                        }}
                      >
                        Paypal
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Icon name="chevron-right" color="#000" />
                    </View>
                  </TouchableOpacity>
                  {item.currencyType == "INR" ? (
                    <TouchableOpacity //....................razorPay
                      style={{
                        width: "98%",
                        height: heightPercentageToDP("7.5%"),
                        flexDirection: "row",
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: "#42aec2",
                        elevation: 10,
                      }}
                      onPress={() => this.razorPay()}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../src/razorPay.png")}
                          style={{
                            width: 30,
                            height: 30,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 5,
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            color: "#454545",
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: 14,
                          }}
                        >
                          Razorpay
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.5,
                          justifyContent: "center",
                          alignItems: "flex-start",
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
              transactionFeeModal: false,
            });
            this.pendingPay(this.state.emiId, "Failed", false);
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
                      this.state.exchangeRate &&
                      this.state.data &&
                      this.state.transactionFee
                        ? item.currencyType == "INR" ||
                          item.currencyType == "CNY"
                          ? Number(
                              (
                                Number(
                                  this.state.data[0].amount +
                                    (this.state.checkBtn
                                      ? Number(transactionFee)
                                      : 0)
                                ) /
                                this.state.exchangeRate["rates"][
                                  item.currencyType
                                ]
                              ).toFixed(2)
                            )
                          : Number(
                              Number(
                                this.state.data[0].amount +
                                  (this.state.checkBtn
                                    ? Number(transactionFee)
                                    : 0)
                              ).toFixed(2)
                            )
                        : 0
                    }" id="price" />
                    <input name="name" value="${
                      this.props.item.paymentName
                    }" id="name" />
                    <input name="currency" value="${
                      item.currencyType == "INR" || item.currencyType == "CNY"
                        ? "USD"
                        : this.props.item.currencyType
                    }" id="currency" />
                    <input name="userId" value="${
                      this.props.userId
                    }" id="userId" />
                    <input name="description" value="Tovp" id="description" />
                  </form>
                </body>
              </html>
              `,
              }}
              onNavigationStateChange={(data) => this.onNavigationChange(data)}
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
        <NavBar
          title="Donor Account"
          noRightBtn={true}
          back={true}
          color="#42aec2"
          titleColor="white"
          callback={true}
          callbackOverdue={(para) => this.props.getOverdueData(para)}
        />
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItemView}
          ListHeaderComponent={() => (
            <View //..................header
              style={{
                width: "90%",
                aspectRatio: 5 / 3,
                alignSelf: "center",
                marginTop: 18,
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomWidth: 1,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.imgs[1] }}
                    style={{
                      width: "90%",
                      height: "90%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={{ flex: 3, paddingLeft: widthPercentageToDP(3) }}>
                  <View style={{ flex: 1.5, justifyContent: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: widthPercentageToDP(3.5),
                        color: "#454545",
                      }}
                    >
                      {item.paymentName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      paddingRight: widthPercentageToDP(3.5),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#454545",
                        fontSize: widthPercentageToDP(3),
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#454545",
                        fontSize: widthPercentageToDP(3),
                      }}
                    >
                      {currencyArr[item.currencyType] +
                        " " +
                        item.amounts[item.currencyType]}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      paddingRight: widthPercentageToDP(3.5),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#454545",
                        fontSize: widthPercentageToDP(3),
                      }}
                    >
                      Quantity
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#454545",
                        fontSize: widthPercentageToDP(3),
                      }}
                    >
                      {item.count}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 0.5 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 18,
                    paddingRight: 18,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP(3.3),
                      color: "#454545",
                    }}
                  >
                    Emi Details
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP(3.3),
                      color: "#454545",
                    }}
                  >
                    {item.totalEmi} months
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 18,
                    paddingRight: 18,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP(3.3),
                      color: "#454545",
                    }}
                  >
                    Amount to be paid/month :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: widthPercentageToDP(3),
                      color: "#454545",
                    }}
                  >
                    {this.state.data
                      ? currencyArr[item.currencyType] +
                        " " +
                        this.state.data[0].amount.toFixed(2)
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "90%",
                height: 0.7,
                alignSelf: "center",
                backgroundColor: "#000",
              }}
            />
          )}
          ListFooterComponent={() => (
            <View
              style={{
                width: "90%",
                height: 10,
                backgroundColor: "#fff",
                alignSelf: "center",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            />
          )}
        />
      </View>
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
    fontSize: 14,
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
    fontSize: widthPercentageToDP("3.1%"),
  },
  modalV: { flex: 1, justifyContent: "center", alignItems: "center" },
});
