import React from "react";
import {
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import { ContextProvider, ContextConsumer } from "./contextApi";
import moment from "moment";
import Icon from "react-native-vector-icons/dist/Feather";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { primaryColor } from "./config";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
export default class NotificationList extends React.Component {
  state = {
    modalView: false,
    item: null,
  };

  componentDidMount() {
    this.linkArr = [];
    this.value.getNotification(); //contextApi
  }

  onNotificationPress = (item) => {
    if (item.body.match(/\bhttps?:\/\/\S+/gi)) {
      this.linkArr = [];
      item.body.match(/\bhttps?:\/\/\S+/gi).forEach((link) => {
        this.linkArr.push(
          <TouchableOpacity
            style={{
              width: "100%",
              //backgroundColor: "red",
              marginBottom: widthPercentageToDP("3.5%"),
            }}
            //key={(index + 1).toString()}
            onPress={() => {
              this.setState({ modalView: false });
              Linking.openURL(link).catch((err) =>
                console.error("An error occurred", err)
              );
            }}
          >
            <Text
              style={{
                color: primaryColor, //"rgb(0,160,248)",
                textDecorationLine: "underline",
                textDecorationColor: primaryColor, //"rgb(0,160,248)",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
                textAlign: "center",
              }}
            >
              {link}
            </Text>
          </TouchableOpacity>
        );
      });
    }
    this.setState({ modalView: true, item });
    console.log("ll", item);
    this.value.putNotification(item.id); //contextApi
  };

  renderView = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onNotificationPress(item)}
        style={{
          width: "100%",
          height: widthPercentageToDP("20%"),
          flexDirection: "row",
          backgroundColor: item.active ? "#fffcf5" : "#fff",
        }}
      >
        <View
          style={{
            flex: 2,
            paddingLeft: widthPercentageToDP("3.8%"),
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            paddingRight: item.active ? 0 : widthPercentageToDP("4%"),
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              color: "#454545",
              fontSize: widthPercentageToDP("3.5%"),
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-Regular",
              color: "#454545",
              fontSize: widthPercentageToDP("3.4%"),
            }}
            numberOfLines={1}
          >
            {item.body}
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-Regular",
              color: "#454545",
              fontSize: widthPercentageToDP("3.2%"),
            }}
          >
            {moment(item.createdOn).fromNow()}
          </Text>
        </View>
        {item.active ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: widthPercentageToDP("3%"),
            }}
          >
            <View
              style={{
                backgroundColor: "#ffd765",
                height: widthPercentageToDP("9%"),
                width: widthPercentageToDP("16%"),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  color: "#454545",
                  fontSize: widthPercentageToDP("3.2%"),
                }}
              >
                NEW
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  emptyListView = () => {
    if (this.value.fetchingNotification) {
      return (
        <View
          style={{
            height: screenHeight - 0.1 * screenHeight,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../src/noNotification.png")}
            style={{
              width: widthPercentageToDP("30%"),
              height: widthPercentageToDP("30%"),
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("4%"),
              color: "#686868",
            }}
          >
            No Notification Here!!!{" "}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <ContextProvider>
        <ContextConsumer>
          {(value) => {
            this.value = value;
            return (
              <View style={{ flex: 1 }}>
                <Modal
                  animationType="fade"
                  visible={this.state.modalView}
                  onRequestClose={() => {
                    this.setState({ modalView: false });
                  }}
                  //dismiss={() => this.setState({ modalView: false })}
                  transparent={true}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(16,16,16,0.2)",
                    }}
                  >
                    {this.state.item ? (
                      <View
                        style={{
                          width: "95%",
                          backgroundColor: "#fff",
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: primaryColor,
                          elevation: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                          height: screenHeight / 2 + 100,
                          // marginTop: screenHeight / 4,
                          // alignSelf: "center"
                        }}
                      >
                        <TouchableOpacity //crossX
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
                          onPress={() => {
                            this.setState({ modalView: false });
                          }}
                        >
                          <View
                            style={{
                              width: widthPercentageToDP(6),
                              height: widthPercentageToDP(6),
                              borderRadius: 40,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#42aec2", //"rgb(255,65,60)"
                            }}
                          >
                            <Icon name="x" color="#fff" size={14} />
                          </View>
                        </TouchableOpacity>
                        <View style={{ width: "100%", height: "90%" }}>
                          <View
                            style={{
                              width: "90%",
                              //justifyContent: "center",
                              //alignItems: "center",
                              alignSelf: "center",
                              //paddingLeft: widthPercentageToDP(3.3),
                              //paddingRight: widthPercentageToDP(3.3),
                              marginTop: widthPercentageToDP("7%"),
                              marginBottom: widthPercentageToDP("2.8%"),
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Montserrat-SemiBold",
                                fontSize: widthPercentageToDP("3.5%"),
                                color: "#454545",
                                textAlign: "center",
                              }}
                            >
                              {this.state.item.title}
                            </Text>
                          </View>
                          <ScrollView
                            style={{
                              width: "95%",
                              //marginTop: widthPercentageToDP("2.8%"),
                              // marginLeft: widthPercentageToDP(3.3),
                              //marginRight: widthPercentageToDP(3.3),
                              borderTopWidth: 0.3,
                              paddingTop: widthPercentageToDP("3.2%"),
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Montserrat-regular",
                                fontSize: widthPercentageToDP("3.3%"),
                                color: "#000",
                                textAlign: "center",
                              }}
                            >
                              {this.state.item.body.split("http")[0]}
                            </Text>
                            {this.linkArr.length ? this.linkArr : null}
                          </ScrollView>
                        </View>
                        <View //bottom
                          style={{
                            width: "100%",
                            height: "5%",
                            position: "absolute",
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "flex-end",
                            paddingRight: widthPercentageToDP("3%"),
                            borderTopWidth: 0.3,
                            //backgroundColor: "red",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Montserrat-Regular",
                              fontSize: widthPercentageToDP("3%"),
                              color: "#454545",
                            }}
                          >
                            {moment(this.state.item.createdOn).format("LL")}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </Modal>
                {Platform.OS === "ios" ? (
                  <View
                    style={{
                      height: getStatusBarHeight(true),
                      width: "100%",
                      backgroundColor: "#42aec2",
                    }}
                  ></View>
                ) : null}
                <StatusBar
                  backgroundColor="#007e92"
                  barStyle={"light-content"}
                />
                <NavBar
                  title={I18n.t("notification")}
                  noRightBtn={true}
                  color="#42aec2" //"rgba(0,0,0,0.01)"
                  titleColor="white"
                />
                <FlatList
                  data={value.notificationArr}
                  renderItem={this.renderView}
                  refreshing={value.notificationRefreshing}
                  onRefresh={value.onRefreshNotification}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={this.emptyListView}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 2,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        width: screenWidth - 18,
                        marginLeft: widthPercentageToDP("3.8%"),
                      }}
                    />
                  )}
                />
              </View>
            );
          }}
        </ContextConsumer>
      </ContextProvider>
    );
  }
}
