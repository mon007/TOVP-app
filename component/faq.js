import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import Icon from "react-native-vector-icons/dist/Feather";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default class FAQ extends React.Component {
  state = {
    data: [
      {
        title: I18n.t("t1"),
        description: I18n.t("d1")
      },
      {
        title: I18n.t("t2"),
        description: I18n.t("d2")
      },
      {
        title: I18n.t("t3"),
        description: I18n.t("d3")
      },
      {
        title: I18n.t("t4"),

        description: I18n.t("d4")
      },
      {
        title: I18n.t("t5"),

        description: I18n.t("d5")
      },
      {
        title: I18n.t("t6"),

        description: I18n.t("d6")
      },
      {
        title: I18n.t("t7"),

        description: I18n.t("d7")
      },
      {
        title: I18n.t("t8"),

        description: I18n.t("d8")
      },
      {
        title: I18n.t("t9"),
        description: I18n.t("d9")
      },
      {
        title: I18n.t("t10"),

        description: I18n.t("d10")
      },
      {
        title: I18n.t("t11"),
        description: I18n.t("d11")
      },
      {
        title: I18n.t("t12"),

        description: I18n.t("d12")
      },
      {
        title: I18n.t("t13"),
        description: I18n.t("d13")
      },
      {
        title: I18n.t("t14"),
        description: I18n.t("d14")
      },
      {
        title: I18n.t("t15"),
        description: I18n.t("d15")
      },
      {
        title: I18n.t("t16"),
        description: I18n.t("d16")
      },
      {
        title: I18n.t("t17"),
        description: I18n.t("d17")
      },
      {
        title: I18n.t("t18"),
        description: I18n.t("d18")
      },
      {
        title: I18n.t("t19"),
        description: I18n.t("d19")
      },
      {
        title: I18n.t("t20"),
        description: I18n.t("d20")
      }
    ],
    arr: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
  };
  onPressExpand = (index, toogle) => {
    if (toogle == "open") {
      let arr = [].concat(this.state.arr);
      arr[index] = true;
      for (i = 0; i < this.state.arr.length; i++) {
        if (i != index) {
          arr[i] = false;
        }
      }
      this.setState({ arr });
    } else {
      let arr = [].concat(this.state.arr);
      arr[index] = false;
      this.setState({ arr });
    }
  };
  renderView = ({ item, index }) => (
    <React.Fragment>
      {this.state.arr[index] ? (
        <View
          style={{
            width: "100%",
            aspectRatio: 5 / 4,
            flexDirection: "row",
            paddingLeft: 18
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "flex-start",
              paddingTop: 14,
              alignItems: "center"
            }}
            onPress={() => this.onPressExpand(index, "close")}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#42aec2",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
                paddingLeft: 1,
                paddingTop: 1
              }}
            >
              <Icon name="minus" color="#fff" size={14} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 6 }}>
            <ScrollView
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.4%")
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.2%")
                }}
              >
                {item.description}
              </Text>
            </ScrollView>
          </View>
          <View style={{ flex: 0.5 }} />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            // aspectRatio: 5 / 1.5,
            paddingLeft: 18
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row" }}
            onPress={() => this.onPressExpand(index, "open")}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#42aec2",
                  justifyContent: "center",
                  paddingLeft: 1,
                  paddingTop: 1,
                  alignItems: "center",
                  borderRadius: 25
                }}
              >
                <Icon name="plus" color="#fff" size={14} />
              </View>
            </View>

            <View style={{ flex: 6, justifyContent: "center", padding: 8 }}>
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.2%")
                }}
              >
                {item.title}
              </Text>
            </View>
            <View style={{ flex: 0.5 }} />
          </TouchableOpacity>
        </View>
      )}
    </React.Fragment>
  );
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          ></View>
        ) : null}
        {Platform.OS === "ios" ? (
          <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        ) : null}
        <NavBar
          title="FAQ"
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        <FlatList
          data={this.state.data}
          renderItem={this.renderView}
          ListHeaderComponent={() => (
            <View
              style={{
                width: "100%",
                aspectRatio: 7 / 1,
                paddingLeft: 18,
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  color: "#454545",
                  fontSize: widthPercentageToDP("4.2%")
                }}
              >
                {I18n.t("generalQuestion")}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
