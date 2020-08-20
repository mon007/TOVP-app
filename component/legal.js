import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar
} from "react-native";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import Icon from "react-native-vector-icons/dist/Feather";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default class Legal extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          ></View>
        ) : null}

        <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        <NavBar
          title={I18n.t("legal")}
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        <View //.....................................terms&privacy
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "flex-start",
            paddingTop: 18
          }}
        >
          <TouchableOpacity //.................................Terms
            style={{
              width: "90%",
              aspectRatio: 5.5 / 1,
              borderRadius: 4,
              elevation: 10,
              flexDirection: "row",
              alignSelf: "center",
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1
            }}
            onPress={() => Actions.push("terms")}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="file-text" size={18} color="#42aec2" />
            </View>
            <View
              style={{
                flex: 4,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  color: "#42aec2",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.6%")
                }}
              >
                Terms and Conditions
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="chevron-right" size={18} color="#42aec2" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity //.................................Privacy
            style={{
              width: "90%",
              aspectRatio: 5.5 / 1,
              borderRadius: 4,
              elevation: 10,
              flexDirection: "row",
              alignSelf: "center",
              backgroundColor: "white",
              marginTop: 18,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1
            }}
            onPress={() => Actions.push("privacy")}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="shield" size={18} color="#42aec2" />
            </View>
            <View
              style={{
                flex: 4,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  color: "#42aec2",
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.6%")
                }}
              >
                Privacy Policy
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="chevron-right" size={18} color="#42aec2" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
