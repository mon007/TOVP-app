import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform
} from "react-native";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { widthPercentageToDP } from "react-native-responsive-screen";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;
export default class AboutUs extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#007e92" barStyle={"light-content"} />
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          />
        ) : null}
        <NavBar
          title={I18n.t("aboutUs")}
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        <ImageBackground
          source={require("../src/aboutUs.png")}
          style={{
            width: "100%",
            height: screenHeight / 3,
            alignItems: "center",
            justifyContent: "flex-end"
          }}
          imageStyle={{ resizeMode: "cover", alignSelf: "center" }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              width: screenWidth - 30,
              height: 70,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10
            }}
          >
            <Text
              style={{
                color: "#454545",
                fontSize: widthPercentageToDP("4%"),
                fontFamily: "Montserrat-Bold"
              }}
            >
              {I18n.t("chairManV")}
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <ScrollView
            style={{
              width: screenWidth - 30,
              height: screenHeight - screenHeight / 3
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                // paddingLeft: 14,
                // paddingRight: 4,
                justifyContent: "space-evenly",
                //alignItems: "center",
                backgroundColor: "rgb(255,255,255)"
              }}
            >
              <Text style={[styles.txt, { paddingTop: 10 }]}>
                {I18n.t("chairManVPara1")}
              </Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara2")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara3")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara4")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara5")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara6")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara7")}</Text>

              <Text style={styles.txt}>{I18n.t("chairManVPara8")}</Text>

              <Text style={[styles.txt, { paddingBottom: 10 }]}>
                {I18n.t("chairManVPara9")}, Ambarisa Das
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  txt: {
    color: "#454545",
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.3%"),
    padding: 12,
    textAlign: "left"
  }
});
