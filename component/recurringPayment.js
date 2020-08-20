import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  Platform,
} from "react-native";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import NetInfo from "@react-native-community/netinfo";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { apiUrl } from "./config";

const currencyArr = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};

const screenHeight = Dimensions.get("window").height;
var toggle = 0;
export default class RecurringPayment extends React.Component {
  state = {
    total: "",
    data: [],
    refreshing: false,
    fetching: true,
    animate: new Animated.Value(0),
  };
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.getOverdueData(false).then(() => {
          Animated.spring(this.state.animate, {
            toValue: 1,
          }).start();
        });
      } else {
        alert("Network error");
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  getOverdueData = async (refreshing) => {
    //console.log("called", this.props.userId);
    this.setState({ fetching: true, refreshing });
    console.log(apiUrl + "user/donor-account/" + this.props.userId);
    fetch(apiUrl + "user/donor-account/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("overdue Data", resJson);
        let arr = [].concat(this.state.data);
        arr = [];
        for (i = 0; i < resJson.length; i++) {
          if (resJson[i].paymentStatus == "Ongoing") {
            arr.push(resJson[i]);
          }
        }
        arr.sort((a, b) => {
          if (a.id > b.id) {
            return -1;
          } else {
            return 1;
          }
        });
        this.setState({
          data: arr,
          //total: total.toFixed(2),
          fetching: false,
          refreshing: false,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          fetching: false,
          refreshing: false,
        });
      });
  };
  renderItemView = ({ item }) => {
    const percent =
      ((100 / item.totalEmi) * (item.totalEmi - item.emiLeft)).toString() + "%";
    const animatedWidth = this.state.animate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", percent],
    });
    return (
      <View
        style={{
          backgroundColor: item.overDue ? "#fbdedf" : "#fff",
          width: "90%",
          aspectRatio: 5 / 3.7,
          alignSelf: "center",
          borderRadius: 5,
          elevation: 10,
          marginTop: 18,
          paddingLeft: 18,
          paddingRight: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
        }}
      >
        <View style={{ flex: 1.3, flexDirection: "row" }}>
          <View //............................imageV
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              source={{ uri: item.imgs[0] }}
              style={{ width: "98%", height: "98%", resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: widthPercentageToDP(2),
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
                fontSize: widthPercentageToDP("3.5%"),
              }}
            >
              {item.paymentName}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
                fontSize: widthPercentageToDP("3.3%"),
              }}
            >
              {currencyArr[item.currencyType] + " " + item.amount}
            </Text>
          </View>
        </View>
        <View //.....................progessBar
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 8,
              backgroundColor: "#ebebeb",
              borderRadius: 10,
              marginBottom: 4,
              alignItems: "flex-start",
            }}
          >
            <Animated.View
              style={{
                width: animatedWidth,
                height: "100%",
                backgroundColor: "#42aec2",
                borderRadius: 10,
                marginBottom: 4,
              }}
            />
          </View>
          <Text
            style={{
              color: "#42aec2",
              fontFamily: "Montserrat-Regular",
              fontSize: 13,
            }}
          >
            {item.totalEmi - item.emiLeft} installments Completed Successfully.
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              Amount to be paid :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              {currencyArr[item.currencyType] +
                " " +
                (item.amount / item.totalEmi).toFixed(2)}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              Quantity :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              {item.count}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              Next installments Date :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              {item.nextInstallmentDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              Last Date :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              {moment(item.emiEndDate).format("LL")}
            </Text>
          </View>
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("3.1%"),
            }}
          >
            {item.totalEmi} installments, Monthly for {item.totalEmi} months
          </Text>
        </View>
        <View //..........btn
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Actions.push("payNow", {
                country: this.props.country,
                item,
                userId: this.props.userId,
                getOverdueData: this.getOverdueData,
                recurringPaymentController: this.props
                  .recurringPaymentController,
                autoCaptureRazorPay: this.props.autoCaptureRazorPay,
              })
            }
            style={{
              backgroundColor: "#42aec2",
              width: 100,
              height: "72%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "#f5f5f5",
                fontSize: widthPercentageToDP("3.4%"),
                textTransform: "uppercase",
              }}
            >
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    //console.log(this.state.refreshing);
    return (
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <View //..................note
          style={{
            width: "100%",
            height: heightPercentageToDP(7),
            paddingLeft: 18,
            paddingRight: 10,
            justifyContent: "center",
            backgroundColor: "#fcf8e3",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: widthPercentageToDP("3.4%"),
              color: "#8d703f",
            }}
          >
            ATTENTION: Donations made only through the TOVP app since 27 August
            2019 are shown here.
          </Text>
        </View>
        {this.state.data.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.state.fetching ? (
              <ActivityIndicator
                value={this.state.fetching}
                color="#42aec2"
                size={Platform.OS === "android" ? 20 : 1}
              />
            ) : (
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.5%"),
                  color: "#454545",
                }}
              >
                No Overdue Payments
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={this.state.data}
            renderItem={this.renderItemView}
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            onRefresh={() => this.getOverdueData(true)}
            ListFooterComponent={() => (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  height: 40,
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }
}
