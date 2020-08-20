import React from "react";
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import NavBar from "../navBar";
import I18n from "react-native-i18n";
import ReadMoreModal from "../readMoreModal";
import LinearGradient from "react-native-linear-gradient";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
export default class HorizontalSwip2 extends React.Component {
  render() {
    return (
      <React.Fragment>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
            }}
          >
            <LinearGradient
              colors={["#fb6d64", "#fb6d64"]}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5,
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            ></LinearGradient>
          </View>
        ) : null}

        <StatusBar backgroundColor="#007e92" barStyle="light-content" />

        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#fb6d64", "#fd4968"]}
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <ImageBackground
              source={require("../../src/tovp_bg_10.png")}
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
              imageStyle={{ resizeMode: "cover" }}
            >
              <NavBar
                title={I18n.t("vision")}
                noRightBtn={true}
                color="rgba(0,0,0,0.01)"
                titleColor="white"
                back={true}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingBottom: 16,
                  paddingLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3.3%"),
                    color: "white",
                    fontFamily: "Montserrat-Bold",
                  }}
                >
                  {I18n.t("horizontalSwipe3")}
                </Text>
              </View>
            </ImageBackground>
          </LinearGradient>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para1")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para2")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para3")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/horizontalSwip1a.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para4")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para5")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para6")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/d.jpeg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para7")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para8")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para9")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para10")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para11")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para12")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para13")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/b.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para14")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para15")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para16")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para17")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para18")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para19")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para20")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para21")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para22")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para23")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para24")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/e.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para25")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para26")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/y.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para27")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para28")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para29")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para30")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para31")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para32")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para33")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para34")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para35")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para36")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para37")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para38")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para39")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para40")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para41")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/s.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para42")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para43")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para44")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para45")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para46")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/v.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para47")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para48")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para49")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para50")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para51")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para52")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para53")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para54")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para55")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para56")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para57")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/t.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para58")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/f.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para59")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para60")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para61")}
            </Text>
          </View>
          <View //...........................temple2
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Image
              source={require("../../src/Madhva.png")}
              style={{
                width: "98%",
                height: "100%",
                resizeMode: "cover",
                alignSelf: "center",
              }}
            />
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/l1.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para62")}
              </Text>
            </View>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para63")}
              </Text>
            </View>
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/l2.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para64")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para65")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para66")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para67")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para68")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para69")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para70")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/d1.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para71")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // justifyContent: "center",
              // alignItems: "center"
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para72")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para73")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para74")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para75")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para76")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/g.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para77")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/a21.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para78")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para79")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para80")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/a22.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para81")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para82")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para83")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para84")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para85")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              // borderBottomWidth: 0.5,
              // borderTopWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para86")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para87")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/d2.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              //borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para88")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              //borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para89")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              //borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para90")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para91")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para92")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para93")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para94")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              //borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para95")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/c2.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para96")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para97")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para98")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.5%"),
                fontFamily: "Montserrat-SemiBold",
                color: "#454545",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para99")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para100")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para101")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Image
                source={require("../../src/American-Way.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              //borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para102")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              borderBottomWidth: 0.5,
              paddingLeft: 10,
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para103")}
            </Text>
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
              <Image
                source={require("../../src/krishna.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
            </View>
            <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("3.3%"),
                  fontFamily: "Montserrat-Regular",
                  color: "#9f8c90",
                }}
                numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
              >
                {I18n.t("h3Para104")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              //borderBottomWidth: 0.5
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para105")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para106")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para107")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para108")}
            </Text>
          </View>
          <View //...........................temple2
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Image
              source={require("../../src/m.jpg")}
              style={{
                width: "98%",
                height: "100%",
                resizeMode: "cover",
                alignSelf: "center",
              }}
            />
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.3%"),
                fontFamily: "Montserrat-Regular",
                color: "#9f8c90",
              }}
              //numberOfLines={9}
            >
              {I18n.t("h3Para109")}
            </Text>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}
