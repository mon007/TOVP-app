import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import I18n from "react-native-i18n";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/dist/Feather";
import { paraColor } from "./config";

export default class ReadMoreModal extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity // cancel btn
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
          onPress={this.props.closeModal}
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
        <ScrollView
          style={{
            flex: 1,
            paddingTop: widthPercentageToDP(6),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: "95%",
              alignSelf: "center",
              aspectRatio: 5 / 4,
            }}
          >
            <Image
              source={this.props.data.pic}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              width: "95%",
              alignSelf: "center",
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3.2%"),
                fontFamily: "Montserrat-Regular",
                color: paraColor,
                textAlign: "center",
              }}
            >
              {I18n.t(this.props.data.para)}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              height: widthPercentageToDP(10),
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
