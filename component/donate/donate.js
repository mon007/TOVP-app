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
  Platform,
} from "react-native";
import NavBar from "../navBar";
import I18n from "react-native-i18n";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import { Actions } from "react-native-router-flux";
import { getStatusBarHeight } from "react-native-status-bar-height";
//import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import NetInfo from "@react-native-community/netinfo";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { apiUrl, appVersion } from "../config";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

var soldOutStatus = null;

/**
 * Donate class hadles the list of products and onPress.
 */
export default class Donate extends React.Component {
  state = {
    index: null,
    type: "",
    modalVisibility: false,
    modalTitle: "",
    soldOutText: "",
    data: [],
    fetching: true,
    exchangerate: "",
    email: "",
  };
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.getEmail();
        this.getProductDetails();
        this.getExchangeRate();
      } else {
        alert("Network error");
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  getEmail = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          email: resJson.email,
        });
      })
      .catch((e) => console.log(e));
  };

  getExchangeRate = () => {
    fetch("https://api.exchangeratesapi.io/latest?base=USD&symbols=INR")
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ exchangerate: resJson });
      });
  };

  getProductDetails = () => {
    this.setState({ fetching: true });
    fetch(`${apiUrl}products?appVersion=${appVersion}`, {
      method: "GET",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let status = res.status;
        let data = res.json();
        return Promise.all([status, data]);
      })
      .then(([status, data]) => {
        console.log(data);
        if (status == 200) {
          let sortedArr = data.sort((a, b) => a._id - b._id);
          this.setState({ data: sortedArr, fetching: false });
        } else {
          alert(data.message);
          this.setState({ fetching: false });
        }
      })
      .catch((e) => console.log(e));
  };
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Tovp App Location Permission",
          message:
            "Tovp App needs access to your location " +
            "to get correct currency.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  /**
   * it handles buttonPress which shows a modal if an item is soldOut and called the helper function.
   */
  onPressBtn = (item, index) => {
    soldOutStatus = item.soldOutStatus;
    if (!soldOutStatus) {
      this.setState({
        modalVisibility: false,
      });
      this.onPressHelperFn(item, index);
    } else {
      this.setState({
        modalVisibility: true,
        modalTitle: item.modalTitle,
        soldOutText: item.name,
      });
    }
  };

  /**
   * onPressHelperFn() redirects to the js file on button press with required props
   * paymentController, autoCaptureRazorPay is passed through here since routerflux doesnot work if single js file gets
   * props from different parents
   */
  onPressHelperFn = (item, index) => {
    let obj = {
      email: this.state.email,
      index: index,
      arr: this.state.data,
      userId: this.props.userId,
      pickerType: this.props.country,
      type: item.type,
      campaingFlag: false,
      country: this.props.country,
      campaignId: null,
      paymentController: this.props.paymentController,
      autoCaptureRazorPay: this.props.autoCaptureRazorPay,
    };
    let flagObj = {
      email: this.state.email,
      index: index,
      arr: this.state.data,
      pickerType: this.props.country,
      userId: this.props.userId,
      type: item.type,
      campaingFlag: false,
      country: this.props.country,
      campaignId: null,
      flagPaymentController: this.props.flagPaymentController,
      autoCaptureRazorPay: this.props.autoCaptureRazorPay,
    };
    switch (item.type) {
      case "coin": {
        Actions.push("singleCoinView", obj);
        break;
      }
      case "pillar": {
        Actions.push("singlePillarView", obj);
        break;
      }
      case "brick": {
        Actions.push("singleBrickView", obj);
        break;
      }
      case "flag": {
        Actions.push("victoryFlag", flagObj);
        break;
      }
      case "tile": {
        Actions.push("singleTitleView", obj);
        break;
      }
      case "squareFoot": {
        Actions.push("singleSquareFootView", obj);
        break;
      }
      case "generalDonation": {
        Actions.push("generalDonation", obj);
        break;
      }
      default: {
        Actions.push("singleBrickView", obj);
      }
    }
  };

  //....................................................onNext screen chnage arr
  /**
   * renderItemView is for the flatlist in the render(), returns a View that loops.
   */
  renderItemView = ({ item, index }) => {
    let amount;
    if (item.amounts) {
      //if (typeof item.amount == "number") {
      this.props.country == "India"
        ? (amount = "₹ " + item.amounts["INR"][0])
        : (amount = "$ " + item.amounts["USD"][0]);
      // } else {
      //   this.props.country == "India"
      //     ? (amount =
      //         "₹ " +
      //         (
      //           item.amount[0] * this.state.exchangerate["rates"]["INR"]
      //         ).toFixed(0))
      //     : (amount = "$ " + item.amount[0].toFixed(0));
      // }
    }
    return (
      <TouchableOpacity //....................donationList
        onPress={() => this.onPressBtn(item, index)}
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
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: widthPercentageToDP("12%"),
              height: widthPercentageToDP("12%"),
              borderRadius: 70,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: item.imgs[1] }}
              style={{
                width: widthPercentageToDP("12%"),
                height: widthPercentageToDP("12%"),
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("3.4%"),
              color: "#454545",
            }}
          >
            {item.title}
          </Text>
          <View
            style={{
              width: "100%",
              height: "30%",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {item.amounts ? (
              <Text
                style={{
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: widthPercentageToDP("3.3%"),
                  color: "#454545",
                }}
              >
                {amount}
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "flex-start",
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
              backgroundColor: "#42aec2",
            }}
          >
            <LinearGradient //...........................topContainer
              colors={["#42aec2", "#007e92"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5,
              }}
            ></LinearGradient>
          </View>
        ) : null}
        {Platform.OS === "ios" ? (
          <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        ) : (
          <StatusBar backgroundColor="#007e92" />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibility}
          onRequestClose={() => this.setState({ modalVisibility: false })}
        >
          {soldOutStatus ? (
            <TouchableOpacity //................modalAlertView
              style={{
                width: "100%",
                height: screenHeight,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
              onPress={() => this.setState({ modalVisibility: false })}
            >
              <TouchableOpacity
                style={{
                  width: "90%",
                  aspectRatio: 5 / 2,
                  backgroundColor: "#dff0d8",
                  borderRadius: 10,
                  elevation: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="bell" size={18} color="#3c763d" />
                <Text
                  style={{
                    color: "#3c763d",
                    fontSize: widthPercentageToDP("3.4%"),
                    textAlign: "center",
                  }}
                >
                  Thank you to all our donors, all available{" "}
                  {this.state.soldOutText} has now been sponsored.
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : null}
        </Modal>
        {!this.state.fetching ? (
          this.state.data.length > 0 ? (
            <FlatList
              style={{ backgroundColor: "#f9f9f9" }}
              data={this.state.data}
              renderItem={this.renderItemView}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <View>
                  <LinearGradient //...........................topContainer
                    colors={["#42aec2", "#007e92"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: "100%",
                      aspectRatio: 5 / 2.5,
                    }}
                  >
                    <ImageBackground
                      source={require("../../src/tovp_bg_10.png")}
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                      }}
                      imageStyle={{ resizeMode: "cover" }}
                    >
                      <NavBar
                        title={I18n.t("donate")}
                        noRightBtn={true}
                        color="rgba(0,0,0,0.01)"
                        titleColor="white"
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          paddingBottom: widthPercentageToDP("5%"),
                          paddingLeft: 18,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: widthPercentageToDP("4%"),
                            color: "white",
                            fontFamily: "Montserrat-Bold",
                          }}
                        >
                          SEVA {I18n.t("opportunities")} - MISSION 22
                        </Text>
                        {/* <View
                          style={{
                            width: "60%",
                            height: "40%",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            paddingTop: 10
                          }}
                        >
                          <Text
                            style={{
                              fontSize: widthPercentageToDP("3.3%"),
                              color: "white",
                              fontFamily: "Montserrat-Regular"
                            }}
                          >
                            {I18n.t("findOut")}
                          </Text>
                        </View> */}
                      </View>
                    </ImageBackground>
                  </LinearGradient>
                  <View //.................................list haeder
                    style={{
                      width: "100%",
                      aspectRatio: 5 / 1.5,
                      justifyContent: "flex-start",
                      paddingLeft: 18,
                      marginBottom: 10,
                      paddingRight: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.2%"),
                        color: "#454545",
                      }}
                    >
                      {I18n.t("donorHeader")}
                    </Text>
                  </View>
                  <View //............................................Quote
                    style={{
                      width: "90%",
                      aspectRatio: 5 / 1.3,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#42aec2",
                      padding: 18,
                      justifyContent: "center",
                      alignSelf: "center",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: widthPercentageToDP("3.3%"),
                        fontFamily: "Montserrat-Regular",
                        color: "#454545",
                      }}
                    >
                      Sources of funds means we get contributions from all over
                      the world. All of our branches will gladly contribute.
                    </Text>
                    <Text
                      style={{
                        paddingTop: 5,
                        fontSize: widthPercentageToDP("3.3%"),
                        fontFamily: "Montserrat-SemiBold",
                        color: "#313131",
                      }}
                    >
                      - Srila Prabhupada
                    </Text>
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: "#f9f9f9",
                        right: -7,
                        top: -7,
                        width: 22,
                        height: 22,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../src/quote.png")}
                        style={{ width: 18, height: 18, resizeMode: "contain" }}
                      />
                    </View>
                  </View>
                  <View //note
                    style={{
                      width: "90%",
                      aspectRatio: 5 / 1.3,
                      alignSelf: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: 10,
                      borderRadius: 5,
                      paddingRight: 10,
                      marginBottom: 18,
                      marginTop: 10,
                      backgroundColor: "#c0d8fe",
                    }}
                  >
                    {/* <Image
                      source={require("../../src/idea_1.png")}
                      style={{ width: 18, height: 18, resizeMode: "contain" }}
                    /> */}
                    <Text
                      style={{
                        color: "#454545",
                        fontSize: widthPercentageToDP("3.2%"),
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      If you want to Donate for Gratitude Coins and Pillars of
                      Devotion, you can directly contact TOVP office. If you
                      have any difficulty while donating, you can email us at
                      fundraising@tovp.org
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <LinearGradient //...........................topContainer
                colors={["#42aec2", "#007e92"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: "100%",
                  aspectRatio: 5 / 2.5,
                }}
              >
                <ImageBackground
                  source={require("../../src/tovp_bg_10.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                  }}
                  imageStyle={{ resizeMode: "cover" }}
                >
                  <NavBar
                    title={I18n.t("donate")}
                    noRightBtn={true}
                    color="rgba(0,0,0,0.01)"
                    titleColor="white"
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "flex-start",
                      paddingBottom: widthPercentageToDP("5%"),
                      paddingLeft: 18,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: widthPercentageToDP("4%"),
                        color: "white",
                        fontFamily: "Montserrat-Bold",
                      }}
                    >
                      SEVA {I18n.t("opportunities")} - MISSION 22
                    </Text>
                    {/* <View
                          style={{
                            width: "60%",
                            height: "40%",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            paddingTop: 10
                          }}
                        >
                          <Text
                            style={{
                              fontSize: widthPercentageToDP("3.3%"),
                              color: "white",
                              fontFamily: "Montserrat-Regular"
                            }}
                          >
                            {I18n.t("findOut")}
                          </Text>
                        </View> */}
                  </View>
                </ImageBackground>
              </LinearGradient>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#f9f9f9",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Currently no Tovp products available</Text>
              </View>
            </View>
          )
        ) : (
          <View style={{ flex: 1 }}>
            <LinearGradient //...........................topContainer
              colors={["#42aec2", "#007e92"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: "100%",
                aspectRatio: 5 / 2.5,
              }}
            >
              <ImageBackground
                source={require("../../src/tovp_bg_10.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
                imageStyle={{ resizeMode: "cover" }}
              >
                <NavBar
                  title={I18n.t("donate")}
                  noRightBtn={true}
                  color="rgba(0,0,0,0.01)"
                  titleColor="white"
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    paddingBottom: widthPercentageToDP("5%"),
                    paddingLeft: 18,
                  }}
                >
                  <Text
                    style={{
                      fontSize: widthPercentageToDP("4%"),
                      color: "white",
                      fontFamily: "Montserrat-Bold",
                    }}
                  >
                    SEVA {I18n.t("opportunities")} - MISSION 22
                  </Text>
                  {/* <View
                          style={{
                            width: "60%",
                            height: "40%",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            paddingTop: 10
                          }}
                        >
                          <Text
                            style={{
                              fontSize: widthPercentageToDP("3.3%"),
                              color: "white",
                              fontFamily: "Montserrat-Regular"
                            }}
                          >
                            {I18n.t("findOut")}
                          </Text>
                        </View> */}
                </View>
              </ImageBackground>
            </LinearGradient>
            <View
              style={{
                flex: 1,
                backgroundColor: "#f9f9f9",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                visible={this.state.fetching}
                color="#42aec2"
                size={Platform.OS === "android" ? 20 : 1}
              />
            </View>
          </View>
        )}
      </React.Fragment>
    );
  }
}
