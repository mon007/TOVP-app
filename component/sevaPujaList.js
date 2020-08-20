import React from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  PermissionsAndroid,
  BackHandler,
  DeviceEventEmitter,
  ActivityIndicator,
  Platform
} from "react-native";
import NavBar from "./navBar";
import I18n from "react-native-i18n";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import { Actions } from "react-native-router-flux";
import { apiUrl } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";
//import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { widthPercentageToDP } from "react-native-responsive-screen";

export default class SevaPujaList extends React.Component {
  state = {
    data: []
  };
  componentDidMount() {
    this.getAllPujaDetails();
  }
  getAllPujaDetails = () => {
    let url = apiUrl + "seva/all";
    fetch(url)
      .then(res => res.json())
      .then(resJson => {
        if (resJson) {
          this.setState({ data: resJson[0][this.props.item.title] });
        }
      })
      .catch(e => console.log(e));
  };
  renderItemView = ({ item }) => {
    return (
      <TouchableOpacity //....................donationList
        onPress={() => {
          Actions.push("sevaPujaSingleView", {
            item: {
              title: Object.keys(item)[0],
              amount: Object.values(item)[0],
              userId: this.props.item.userId,
              getSevaHistory: this.props.getSevaHistory
            }
          });
        }}
        style={{
          width: "90%",
          aspectRatio: 5.5 / 1,
          borderRadius: 5,
          elevation: 10,
          flexDirection: "row",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          alignSelf: "center",
          marginBottom: 12,
          paddingLeft: 16,
          paddingRight: 10,
          backgroundColor: "#fff"
        }}
      >
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 10
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("3.4%"),
              color: "#454545"
            }}
          >
            {Object.keys(item)[0] + "- " + Object.values(item)[0]}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Icon name="chevron-right" color="#42aec2" size={16} />
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <React.Fragment>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2"
            }}
          >
            <LinearGradient //...........................topContainer
              colors={["#42aec2", "#007e92"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5
              }}
            ></LinearGradient>
          </View>
        ) : null}
        {Platform.OS === "ios" ? (
          <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        ) : (
          <StatusBar backgroundColor="#007e92" />
        )}

        <FlatList
          style={{ backgroundColor: "#f9f9f9" }}
          data={this.state.data}
          renderItem={this.renderItemView}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#454545",
                  fontFamily: "Montserrat-Bold",
                  fontSize: widthPercentageToDP("3.1%")
                }}
              >
                No Puja available
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              <LinearGradient //...........................topContainer
                colors={["#42aec2", "#007e92"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: "100%",
                  aspectRatio: 5 / 2.5
                }}
              >
                <ImageBackground
                  source={require("../src/tovp_bg_10.png")}
                  style={{
                    width: "100%",
                    height: "100%"
                    // justifyContent: "flex-end",
                    // alignItems: "flex-start"
                  }}
                  imageStyle={{ resizeMode: "cover" }}
                >
                  <NavBar
                    title={I18n.t("redeemPoints")} //{I18n.t("donate")}
                    noRightBtn={true}
                    color="rgba(0,0,0,0.01)"
                    titleColor="white"
                    back={true}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingBottom: widthPercentageToDP("5%")
                    }}
                  >
                    <View //........image
                      style={{
                        flex: 2,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          width: 55,
                          height: 55,
                          borderRadius: 70,
                          overflow: "hidden"
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover"
                          }}
                          source={this.props.item.pic}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: widthPercentageToDP("4%"),
                        color: "white",
                        fontFamily: "Montserrat-Bold"
                      }}
                    >
                      {this.props.item.title}
                    </Text>
                  </View>
                </ImageBackground>
              </LinearGradient>
              <View
                style={{
                  width: "100%",
                  aspectRatio: 5 / 1.3,
                  paddingTop: 20,
                  paddingLeft: 18
                  //backgroundColor: "red"
                }}
              >
                <Text
                  style={{
                    color: "#454545",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: widthPercentageToDP("3.5%")
                  }}
                >
                  List of redemption details for share your bhakti.
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </React.Fragment>
    );
  }
}
