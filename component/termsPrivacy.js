import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/dist/Feather";
import I18n from "react-native-i18n";

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
const TermsPrivacy = (props) => (
  <View style={{ flex: 1 }}>
    <TouchableOpacity
      style={{
        position: "absolute",
        width: 40,
        height: 40,
        right: -5,
        top: -5,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3,
      }}
      onPress={props.closeModal}
    >
      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#42aec2", //"rgb(255,65,60)"
        }}
      >
        <Icon name="x" color="#fff" size={14} />
      </View>
    </TouchableOpacity>
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          aspectRatio: 6 / 1,
          justifyContent: "center",
          borderBottomWidth: 0.4,
          paddingLeft: widthPercentageToDP(3),
          paddingRight: widthPercentageToDP(3),
        }}
      >
        <Text style={styles.txtHeader}>Terms and Conditions</Text>
      </View>
      {termsAndCondition.map((item, index) => (
        <View
          key={index.toString()}
          style={{
            flex: 1,
            paddingLeft: widthPercentageToDP(3),
            paddingRight: widthPercentageToDP(3),
          }}
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
          width: "100%",
          aspectRatio: 6 / 1,
          justifyContent: "center",
          borderBottomWidth: 0.4,
          paddingLeft: widthPercentageToDP(3),
          paddingRight: widthPercentageToDP(3),
        }}
      >
        <Text style={styles.txtHeader}>Privacy Policy</Text>
      </View>
      {privacyArr.map((item, index) => (
        <View
          key={index.toString()}
          style={{
            flex: 1,
            paddingLeft: widthPercentageToDP(3),
            paddingRight: widthPercentageToDP(3),
          }}
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
  },
});
export { TermsPrivacy };
