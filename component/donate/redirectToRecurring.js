import React from "react";
import { View, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import { widthPercentageToDP } from "react-native-responsive-screen";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default class RedirectRecurring extends React.Component {
  render() {
    return (
      <View
        style={{
          width: screenWidth,
          height: screenHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: "90%",
            height: screenHeight / 2 - 120,
            borderRadius: 10,
            zIndex: 2
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                width: widthPercentageToDP("10%"),
                height: widthPercentageToDP("10%"),
                right: -5,
                top: -5,
                borderRadius: widthPercentageToDP("10%"),
                justifyContent: "center",
                alignItems: "center",
                zIndex: 3
              }}
              onPress={this.props.cancel}
            >
              <View
                style={{
                  width: widthPercentageToDP("6%"),
                  height: widthPercentageToDP("6%"),
                  borderRadius: widthPercentageToDP("8%"),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#42aec2" //"rgb(255,65,60)"
                }}
              >
                <Icon
                  name="x"
                  color="#fff"
                  size={widthPercentageToDP("3.5%")}
                />
              </View>
            </TouchableOpacity>
            <Image
              source={require("../../src/warning.png")}
              style={{
                width: widthPercentageToDP("12%"),
                height: widthPercentageToDP("12%"),
                resizeMode: "contain"
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: widthPercentageToDP("3%"),
              paddingRight: widthPercentageToDP("3%")
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
                color: "#454545",
                textAlign: "center"
              }}
            >
              Dear Donor, You have recurring Payment for existing pledge. Press
              Continue to pay your existing EMI.
            </Text>
          </View>
          <View
            style={{
              flex: 0.6,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                width: widthPercentageToDP("25%"),
                height: widthPercentageToDP("12%"),
                backgroundColor: "#42aec2",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: widthPercentageToDP("2%")
              }}
              onPress={this.props.continue}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.5%"),
                  color: "#fff"
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
