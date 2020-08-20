import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import Svg, { G, Path } from "react-native-svg";
import { Actions } from "react-native-router-flux";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ContextProvider, ContextConsumer } from "./contextApi";

const notification = (
  <Svg width={16.85} height={19.621}>
    <G data-name="Group 11">
      <G data-name="Group 10">
        <Path
          fill="#fff" //"#fd4968"
          d="M13.801 14.019l-1.189-1.982a5.888 5.888 0 0 1-.839-3.029V7.272A4.854 4.854 0 0 0 8.31 2.628V1.385a1.385 1.385 0 0 0-2.77 0v1.243a4.854 4.854 0 0 0-3.463 4.644v1.736a5.891 5.891 0 0 1-.839 3.029L.049 14.019a.347.347 0 0 0 .3.525h13.155a.346.346 0 0 0 .3-.524z"
          data-name="Path 1193"
        />
      </G>
    </G>
    <G data-name="Group 13">
      <G data-name="Group 12">
        <Path
          fill="#fff" //"#fd4968"
          d="M4.744 15.236a2.409 2.409 0 0 0 4.362 0z"
          data-name="Path 1194"
        />
      </G>
    </G>
  </Svg>
);
const navBarHeight = heightPercentageToDP(8);

export default class NavBar extends Component {
  backNavBar = (
    <View
      style={{
        height: navBarHeight,
        width: "100%",
        backgroundColor: this.props.color ? this.props.color : "#fff",
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (this.props.callback) {
            Actions.pop();
            this.props.callbackOverdue(false);
          } else {
            Actions.pop();
          }
        }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Icon
          name="arrow-left"
          size={18}
          color={this.props.titleColor ? this.props.titleColor : "#fd4968"}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 18,
        }}
      >
        <Text
          style={{
            color: this.props.titleColor ? this.props.titleColor : "#313131",
            fontSize: widthPercentageToDP("4.5%"),
            textTransform: "uppercase",
          }}
        >
          {this.props.title}
        </Text>
      </View>
      {this.props.noRightBtn ? (
        <View style={{ flex: 1.5 }} />
      ) : (
        <View
          style={{
            flex: 1.5,
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {notification}
          <Icon name="user" size={22} color="#fd4968" />
        </View>
      )}
    </View>
  );
  render() {
    if (this.props.back) {
      return this.backNavBar;
    } else {
      return (
        <View
          style={{
            height: navBarHeight,
            width: "100%",
            backgroundColor: this.props.color ? this.props.color : "#fff",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => Actions.drawerOpen()}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="menu"
              size={18}
              color={this.props.titleColor ? this.props.titleColor : "#fd4968"}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 4,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 18,
            }}
          >
            <Text
              style={{
                color: this.props.titleColor
                  ? this.props.titleColor
                  : "#313131",
                fontSize: widthPercentageToDP("4.5%"),
                textTransform: "uppercase",
              }}
            >
              {this.props.title}
            </Text>
          </View>
          {this.props.noRightBtn ? (
            <View style={{ flex: 1.5 }} />
          ) : (
            //............................notification btn
            <View
              style={{
                flex: 1.5,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 18,
                //flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  paddingLeft: 2,
                  alignItems: "center",
                  borderRadius: 30,
                  backgroundColor: "#42aec2",
                }}
                onPress={() => Actions.push("notificationList")}
              >
                {this.props.numberOfNotification ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "#ff6663",
                      width: 10,
                      height: 10,
                      borderRadius: 15,
                      zIndex: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 5,
                      }}
                    >
                      {this.props.numberOfNotification}
                    </Text>
                  </View>
                ) : null}
                {notification}
                {/* <ContextProvider>
                  <ContextConsumer>
                    {value => {
                      if (value.unread) {
                        return (
                          <View
                            style={{
                              position: "absolute",
                              right: 6,
                              top: 6,
                              width: 8,
                              height: 8,
                              borderRadius: 20,
                              backgroundColor: "red"
                            }}
                          />
                        );
                      }
                    }}
                  </ContextConsumer>
                </ContextProvider> */}
              </TouchableOpacity>

              {/* <Icon name="user" size={22} color="#fd4968" /> */}
            </View>
          )}
        </View>
      );
    }
  }
}
