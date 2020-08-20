import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import NavBar from "./navBar";
import { apiUrl, primaryColor } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Toast from "react-native-simple-toast";

const currencyArr = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};
export default class Receipt extends React.Component {
  state = {
    data: [],
    fetching: true,
    refreshing: false,
    modalVisibility: false,
  };
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({ fetching: true });
        this.fetch();
      } else {
        alert("Network Error");
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  fetch = () => {
    fetch(apiUrl + "paid/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("80G", resJson);
        let data = [].concat(this.state.data);
        let data1 = [];
        for (i = 0; i < resJson.length; i++) {
          if (resJson[i].paymentStatus == "Completed") {
            data1.push(resJson[i]);
          }
        }
        data = data1.sort((a, b) => {
          if (a.arrangeDate > b.arrangeDate) {
            return -1;
          } else {
            return 1;
          }
        });

        this.setState({ data, fetching: false, refreshing: false });
      })
      .catch((e) => console.log(e));
  };

  onBtnClick = (id) => {
    let url = `${apiUrl}receipt/${id}?email=${this.props.email}`;
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          // alert(resJson.message);
          Alert.alert(resJson.message);
        }
      })
      .catch((e) => {
        Toast.show("Something went wrong", Toast.LONG);
      });
  };

  uponRefresh = () => {
    this.setState({ refreshing: true });
    this.fetch(false);
  };

  renderItemView = ({ item }) => (
    <View
      style={{
        width: "100%",
        aspectRatio: 5 / 1.8,
        flexDirection: "row",
        borderWidth: 0.5,
        backgroundColor: "#fff",
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 1
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
            flex: 1.8,
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
        <TouchableOpacity
          onPress={() => this.onBtnClick(item.id)}
          style={{
            width: widthPercentageToDP("25%"),
            height: widthPercentageToDP("10%"),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#008000",
            elevation: 5,
            borderRadius: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
          }}
        >
          <Text style={[styles.txt1, { color: "#fff" }]}>Get Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
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
          title="Profile"
          color="#42aec2"
          titleColor="#fff"
          noRightBtn={true}
          back={true}
        />
        {this.state.data.length == 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
                No 80G receipts available
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: "#f9f9f9" }}
            data={this.state.data}
            renderItem={this.renderItemView}
            refreshing={this.state.refreshing}
            onRefresh={() => this.uponRefresh()}
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
                    fontSize: widthPercentageToDP("3.4%"),
                  }}
                >
                  80G Receipts
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => (
              <View style={{ width: "100%", height: 10 }} />
            )}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  v1: { flex: 1, justifyContent: "center", alignItems: "flex-start" },
  txt1: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.2%"),
    color: "#454545",
  },
  v2: { flex: 1, justifyContent: "center", alignItems: "flex-end" },
});
