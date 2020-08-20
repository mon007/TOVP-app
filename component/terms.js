import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/dist/Feather";
import I18n from "react-native-i18n";
import NavBar from "./navBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { titleColor } from "./config";

const termsAndCondition = [
  {
    header: "th1",
    para: "tp1",
  },
  {
    header: "th2",
    para: "tp2",
  },
  {
    header: "th3",
    para: "tp3",
  },
  {
    header: "th4",
    para: "tp4",
  },
  {
    header: "th5",
    para: "tp5",
  },
  {
    header: "th6",
    para: "tp6",
  },
  {
    header: "th7",
    para: "tp7",
  },
  {
    header: "th8",
    para: "tp8",
  },
  {
    header: "th9",
    para: "tp9",
  },
  {
    header: "th10",
    para: "tp10",
  },
  {
    header: "th11",
    para: "tp11",
  },
  {
    header: "th12",
    para: "tp12",
  },
  {
    header: "th13",
    para: "tp13",
  },
];
const Terms = (props) => (
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
      title="Terms & Conditions"
      noRightBtn={true}
      back={true}
      color="#42aec2"
      titleColor="white"
    />
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          width: "100%",
          aspectRatio: 6 / 1,
          justifyContent: "center",
          borderBottomWidth: 0.4,
          paddingLeft: 10,
        }}
      >
        <Text style={styles.txtHeader}>Terms and Conditions</Text>
      </View>
      {termsAndCondition.map((item, index) => (
        <View
          key={index.toString()}
          style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}
        >
          <Text style={styles.txtHeader2}>{I18n.t(item.header)}</Text>
          <Text style={styles.txtPara}>{I18n.t(item.para)}</Text>
        </View>
      ))}

      <View
        style={{
          height: 10,
          width: "100%",
          borderTopWidth: 0.3,
          paddingTop: 10,
        }}
      />
      <View
        style={{
          height: 10,
          width: "100%",
          borderTopWidth: 0.3,
          paddingTop: 10,
        }}
      />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  txtHeader: {
    fontFamily: "Montserrat-Bold",
    fontSize: widthPercentageToDP("4%"),
    color: "#000",
  },
  txtHeader2: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: widthPercentageToDP("3.5%"),
    color: "#000",
    paddingTop: 10,
    paddingBottom: 10,
  },
  txtPara: {
    fontFamily: "Montserrat-Regular",
    fontSize: widthPercentageToDP("3.3%"),
    color: titleColor,
  },
});
export { Terms };
