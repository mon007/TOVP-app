import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/dist/Feather";
import I18n from "react-native-i18n";
import NavBar from "./navBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { titleColor } from "./config";

const privacyArr = [
  {
    header: "h1",
    para: "p1",
  },
  {
    header: "h2",
    para: "p2",
  },
  {
    header: "h3",
    para: "p3",
  },
  {
    header: "h4",
    para: "p4",
  },
  {
    header: "h5",
    para: "p5",
  },
  {
    header: "h6",
    para: "p6",
  },
  {
    header: "h7",
    para: "p7",
  },
  {
    header: "h8",
    para: "p8",
  },
  {
    header: "h9",
    para: "p9",
  },
  {
    header: "h10",
    para: "p10",
  },
  {
    header: "h11",
    para: "p11",
  },
];

const Privacy = (props) => (
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
      title="Privacy Policy"
      noRightBtn={true}
      back={true}
      color="#42aec2"
      titleColor="white"
    />
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
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
          width: "100%",
          aspectRatio: 6 / 1,
          justifyContent: "center",
          borderBottomWidth: 0.4,
          paddingLeft: 10,
        }}
      >
        <Text style={styles.txtHeader}>Privacy Policy</Text>
      </View>
      {privacyArr.map((item, index) => (
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
export { Privacy };
