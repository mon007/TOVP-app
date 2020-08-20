import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { apiUrl, primaryColor } from "./config";
import { Actions } from "react-native-router-flux";
import Toast from "react-native-simple-toast";

const currencyArr = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};
export default class Paid extends React.Component {
  state = {
    data: [],
    fetching: true,
    refreshing: false,
  };
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.fetchData(true);
      } else {
        alert("Network Error");
      }
    });
  }
  fetchData = (initial) => {
    if (initial) {
      this.setState({ fetching: true });
    }
    fetch(apiUrl + "paid/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          let data = [].concat(this.state.data);
          data = resJson;
          // data = resJson.sort((a, b) => {
          //   if (a.arrangeDate < b.arrangeDate) {
          //     return -1;
          //   } else {
          //     return 1;
          //   }
          // });
          console.log("paid1111", data);
          this.setState({ data, fetching: false, refreshing: false });
        }
      })
      .catch((e) => console.log(e));
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  uponRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData(false);
  };
  renderItemView = ({ item }) => (
    <View
      style={{
        width: "95%",
        alignSelf: "center",
        aspectRatio: 5 / 2,
        borderWidth: 0.8,
        borderColor:
          item.paymentStatus == "Completed"
            ? "rgb(94,170,70)"
            : item.paymentStatus == "Pending"
            ? "rgb(246,166,36)"
            : "rgb(234,87,67)",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        borderRadius: 4,
        backgroundColor: "#fff",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingLeft: widthPercentageToDP(3),
          paddingTop: widthPercentageToDP(1),
          paddingBottom: widthPercentageToDP(1),
        }}
      >
        <View //Product NAme
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.txt1}>{item.name}</Text>
        </View>
        <View //paymentAmount
          style={[
            styles.v1,
            {
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingLeft: widthPercentageToDP(1),
            },
          ]}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Amount:
          </Text>
          <Text
            style={{
              color: "#454545",
              fontSize: widthPercentageToDP("3%"),
              fontFamily: "Montserrat-Regular",
              paddingLeft: widthPercentageToDP(3),
            }}
          >
            {currencyArr[item.currencyType] +
              " " +
              Number(item.amount).toFixed(2)}
          </Text>
        </View>
        {item.emiNo && (
          <View //Emi
            style={[
              styles.v1,
              {
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingLeft: widthPercentageToDP(1),
              },
            ]}
          >
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP(3),
              }}
            >
              Emi Number:
            </Text>
            <Text
              style={{
                color: "#454545",
                fontSize: widthPercentageToDP("3%"),
                fontFamily: "Montserrat-Regular",
                paddingLeft: widthPercentageToDP(3),
              }}
            >
              {item.emiNo}
            </Text>
          </View>
        )}
        <View //PaymentType
          style={[
            styles.v1,
            {
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingLeft: widthPercentageToDP(1),
            },
          ]}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Payment type:
          </Text>
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-Regular",
              fontSize: widthPercentageToDP(3),
              paddingLeft: widthPercentageToDP(3),
            }}
          >
            {item.paymentMode}
          </Text>
        </View>
        <View //paymentId
          style={[
            styles.v1,
            {
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingLeft: widthPercentageToDP(1),
            },
          ]}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Payment Id:
          </Text>
          <Text
            style={{
              color: "#454545",
              fontSize: widthPercentageToDP("3%"),
              fontFamily: "Montserrat-Regular",
              paddingLeft: widthPercentageToDP(3),
            }}
          >
            {item.id}
          </Text>
        </View>
        <View //payment Date
          style={[
            styles.v1,
            {
              justifyContent: "flex-start",
              flexDirection: "row",
              paddingLeft: widthPercentageToDP(1),
            },
          ]}
        >
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP(3),
            }}
          >
            Payment Date:
          </Text>
          <Text
            style={{
              color: "#454545",
              fontFamily: "Montserrat-Regular",
              fontSize: widthPercentageToDP(3),
              paddingLeft: widthPercentageToDP(3),
            }}
          >
            {item.date}
          </Text>
        </View>
      </View>
      <View //btn
        style={{
          flex: 0.5,
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          paddingRight: widthPercentageToDP(3),
        }}
      >
        <View
          style={{
            width: 70,
            height: 28,
            borderRadius: 2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              item.paymentStatus == "Completed"
                ? "rgb(94,170,70)"
                : item.paymentStatus == "Pending"
                ? "rgb(246,166,36)"
                : "rgb(234,87,67)",
          }}
        >
          <Text style={{ color: "#fff" }}>
            {item.paymentStatus == "Completed"
              ? "Paid"
              : item.paymentStatus == "Pending"
              ? "Pending"
              : "Failed"}
          </Text>
        </View>
        {item.paymentStatus == "Pending" ? (
          <TouchableOpacity
            style={{
              width: 70,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(246,166,36)",
              elevation: 10,
            }}
            onPress={() =>
              Actions.push("contactUs", { id: "Payment Id: " + item._id })
            }
          >
            <Text style={{ color: "#fff" }}>Enquire</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
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
              backgroundColor: "#f9f9f9",
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
                No Paid donation
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: "#f9f9f9", flex: 1 }}
            data={this.state.data}
            refreshing={this.state.refreshing}
            onRefresh={() => this.uponRefresh()}
            renderItem={this.renderItemView}
            ListHeaderComponent={() => (
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingLeft: 20,
                  paddingTop: 16,
                  width: "100%",
                  aspectRatio: 6.5 / 1,
                }}
              >
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 16,
                  }}
                >
                  Latest
                </Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={{ height: widthPercentageToDP(8) }} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{ width: "100%", height: widthPercentageToDP(4) }} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  v1: { flex: 1, justifyContent: "center", alignItems: "center" },
  txt1: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.2%"),
    color: "#454545",
  },
  v2: { flex: 1, justifyContent: "center", alignItems: "flex-end" },
});
