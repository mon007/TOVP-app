import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import NavBar from "./navBar";
import CampaignSlide from "./campaignSlide";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import I18n from "react-native-i18n";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { apiUrl, appVersion, primaryColor } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import NetInfo from "@react-native-community/netinfo";

export default class Campaign extends React.Component {
  state = {
    data: [],
    fetching: true,
    notExpired: false,
    email: "",
    horizontalData: [
      {
        pic: require("../src/mission22newLogo.jpg"),
        price: "$10,000",
        emi: "$5,500",
        totalInstallment: 12,
        paidInstallments: 4,
      },
      {
        pic: require("../src/mission22newLogo.jpg"),
        price: "$10,000",
        emi: "$5,500",
        totalInstallment: 12,
        paidInstallments: 10,
      },
      {
        pic: require("../src/mission22newLogo.jpg"),
        price: "$10,000",
        emi: "$5,500",
        totalInstallment: 12,
        paidInstallments: 7,
      },
    ],
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.getCampaigns();
        this.getEmail();
      } else {
        alert("Network error");
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getEmail = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          email: resJson.email,
        });
      })
      .catch((e) => console.log(e));
  };

  getCampaigns = () => {
    this.setState({ fetching: true });
    fetch(`${apiUrl}campaigns?appVersion=${appVersion}`)
      .then((res) => {
        let status = res.status;
        let data = res.json();
        return Promise.all([status, data]);
      })
      .then(([status, data]) => {
        console.log("c", data);
        if (status == 200) {
          let horizontalData = [];
          let notExpired = false;
          for (i = 0; i < data.length; i++) {
            if (
              data[i].imgs[0] &&
              moment(data[i]["dateOfExpiration"]).add(1, "day") > Date.now()
            ) {
              horizontalData.push(data[i].imgs[0]);
            }
            if (
              moment(data[i]["dateOfExpiration"]).add(1, "day") > Date.now()
            ) {
              notExpired = true;
            }
          }
          console.log("a", data);
          this.setState({
            data,
            horizontalData,
            fetching: false,
            notExpired,
          });
        } else {
          alert(data.message);
          this.setState({ fetching: false });
        }
      });
  };

  flatlistRender = ({ item }) =>
    moment(item["dateOfExpiration"]).add(1, "day") > Date.now() ? (
      <View
        style={{
          width: "95%",
          alignSelf: "center",
          aspectRatio: 5 / 1.5,
          flexDirection: "row",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          elevation: 10,
          borderWidth: 0.1,
          borderRadius: 10,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flex: 1.5,
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            paddingLeft: widthPercentageToDP("3.5%"),
          }}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("3%"),
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-Regular",
              fontSize: widthPercentageToDP("3.5%"),
            }}
          >
            last date {moment(item.dateOfExpiration).format("DD.MM.YYYY")}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: widthPercentageToDP("3.5%"),
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 0.1,
              backgroundColor: primaryColor,
              width: 100,
              height: 40,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              Actions.push("singleCampaign", {
                item,
                userId: this.props.userId,
                email: this.state.email,
                country: this.props.country,
                _id: item._id,
                paymentController: this.props.paymentController,
                flagPaymentController: this.props.flagPaymentController,
                autoCaptureRazorPay: this.props.autoCaptureRazorPay,
              })
            }
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.3%"),
              }}
            >
              Donate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;

  render() {
    if (!this.state.fetching) {
      if (this.state.data.length != 0 && this.state.notExpired) {
        return (
          <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            {Platform.OS === "ios" ? (
              <View
                style={{
                  height: getStatusBarHeight(true),
                  width: "100%",
                  backgroundColor: "#42aec2",
                }}
              ></View>
            ) : null}
            <StatusBar backgroundColor="#007e92" barStyle="light-content" />
            <NavBar
              title={I18n.t("campaigns")}
              color="#42aec2"
              titleColor="#fff"
              noRightBtn={true}
            />
            <View style={{ width: "100%", aspectRatio: 5 / 2 }}>
              <CampaignSlide
                data={this.state.horizontalData}
                item={this.state.data}
                userId={this.props.userId}
                email={this.state.email}
                country={this.props.country}
              />
            </View>

            <View
              style={{
                width: "100%",
                aspectRatio: 6 / 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: 18,
              }}
            >
              <Text
                style={{
                  color: "#454545",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.5%"),
                }}
              >
                On Going Campaigns
              </Text>
            </View>
            <FlatList
              data={this.state.data}
              renderItem={this.flatlistRender}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: "90%",
                    height: widthPercentageToDP(3),
                    alignSelf: "center",
                  }}
                />
              )}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: widthPercentageToDP(10),
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        );
      } else {
        return (
          <React.Fragment>
            {Platform.OS === "ios" ? (
              <View
                style={{
                  height: getStatusBarHeight(true) - 10,
                  width: "100%",
                  backgroundColor: "#42aec2",
                }}
              ></View>
            ) : null}
            {Platform.OS === "ios" ? (
              <StatusBar backgroundColor="#007e92" barStyle="light-content" />
            ) : null}
            <NavBar
              title={I18n.t("campaigns")}
              color="#42aec2"
              titleColor="#fff"
              noRightBtn={true}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.5%"),
                  color: "#454545",
                }}
              >
                No Campaigns available
              </Text>
            </View>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          {Platform.OS === "ios" ? (
            <View
              style={{
                height: getStatusBarHeight(true) - 10,
                width: "100%",
                backgroundColor: "#42aec2",
              }}
            ></View>
          ) : null}
          {Platform.OS === "ios" ? (
            <StatusBar backgroundColor="#007e92" barStyle="light-content" />
          ) : null}
          <NavBar
            title={I18n.t("campaigns")}
            color="#42aec2"
            titleColor="#fff"
            noRightBtn={true}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              visible={this.state.fetching}
              color="#42aec2"
              size={Platform.OS === "android" ? 20 : 1}
            />
          </View>
        </React.Fragment>
      );
    }
  }
}
