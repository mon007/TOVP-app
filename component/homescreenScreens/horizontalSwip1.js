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
export default class HorizontalSwip1 extends React.Component {
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
                  {I18n.t("horizontalSwipe1")}
                </Text>
              </View>
            </ImageBackground>
          </LinearGradient>
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
                source={require("../../src/horizontalSwip1a.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: widthPercentageToDP("2.5%"),
                  color: "#9f8c90",
                }}
                numberOfLines={3}
              >
                {I18n.t("h1V1")}
              </Text>
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
                {I18n.t("h1Para1")}
              </Text>
            </View>
          </View>
          <View //............................................ text
            style={{
              width: "100%",
              aspectRatio: 5 / 2.8,
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
              {I18n.t("h1Para2")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              paddingLeft: 10,
              borderBottomWidth: 0.5,
              justifyContent: "center",
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
              {I18n.t("h1Para3")}
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
                {I18n.t("h1Para4")}
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
                source={require("../../src/a.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: widthPercentageToDP("2.5%"),
                  color: "#9f8c90",
                }}
                numberOfLines={3}
              >
                {I18n.t("h1V2")}
              </Text>
            </View>
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
              {I18n.t("h1Para5")}
            </Text>
          </View>
          <View //............................................ text
            style={{
              flex: 1,
              paddingLeft: 10,
              paddingTop: 10,
              borderBottomWidth: 0.5,
              justifyContent: "center",
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
              {I18n.t("h1Para6")}
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
                source={require("../../src/b.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: widthPercentageToDP("2.5%"),
                  color: "#9f8c90",
                }}
                numberOfLines={3}
              >
                {I18n.t("h1V3")}
              </Text>
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
                {I18n.t("h1Para7")}
              </Text>
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
              {I18n.t("h1Para8")}
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
              {I18n.t("h1Para9")}
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
              {I18n.t("h1Para10")}
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
              {I18n.t("h1Para11")}
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
                {I18n.t("h1Para12")}
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
                source={require("../../src/c.jpg")}
                style={{ width: "100%", height: "90%", resizeMode: "contain" }}
              />
              <Text
                style={{
                  fontSize: widthPercentageToDP("2.5%"),
                  color: "#9f8c90",
                }}
                numberOfLines={3}
              >
                {I18n.t("h1V4")}
              </Text>
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
              {I18n.t("h1Para13")}
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
              {I18n.t("h1Para14")}
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
              {I18n.t("h1Para15")}
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
              {I18n.t("h1Para16")}
            </Text>
          </View>
          <View style={{ width: "100%", height: 20 }} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
