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

import { apiUrl } from "./config";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

const currencyArr = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CNY: "¥",
};

export default class CompletedPledges extends React.Component {
  state = {
    data: [],
    refreshing: false,
    fetching: true,
  };

  componentDidMount() {
    this.fetchCompletedPledges(false);
  }

  fetchCompletedPledges = (refreshing) => {
    this.setState({ fetching: true, refreshing });
    fetch(`${apiUrl}user/donor-account/completed/${this.props.userId}`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ data: resJson, refreshing: false, fetching: false });
      })
      .catch((e) => console.log(e));
  };

  renderItemView = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        width: "90%",
        height: widthPercentageToDP(26),
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
        flexDirection: "row",
      }}
    >
      <View //............................imageV
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.imgs[0] }}
          style={{
            width: "90%",
            height: "90%",
            resizeMode: "contain",
          }}
        />
      </View>
      <View
        style={{
          flex: 3.5,
          paddingLeft: widthPercentageToDP(3),
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              color: "#454545",
              fontSize: widthPercentageToDP("3%"),
            }}
          >
            {item.paymentName}
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              color: "#454545",
              fontSize: widthPercentageToDP("3%"),
            }}
          >
            {currencyArr[item.currencyType] + " " + item.amount}
          </Text>
        </View>

        <View
          style={{
            flex: 1.5,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              Payment type :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              {item.paymentType}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              Total Emi :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              {item.totalEmi}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#454545",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              Quantity :{" "}
            </Text>
            <Text
              style={{
                color: "#515555",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3%"),
              }}
            >
              {item.count}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

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
                No Completed Pledges
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={this.state.data}
            renderItem={this.renderItemView}
            showsVerticalScrollIndicator={false}
            refreshing={this.state.refreshing}
            onRefresh={() => this.fetchCompletedPledges(true)}
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
