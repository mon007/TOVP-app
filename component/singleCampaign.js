import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import NavBar from "./navBar";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { apiUrl, titleColor } from "./config";

var data = {
  pic: require("../src/mission22.jpg"),
  targetAmount: "$10,000",
  raisedAmount: "$10,000",
  title: "OUR MISSION 22 MARATHON",
  colorTitle: "Your devotion is our inspiration",
  description:
    "In a moment of extreme compassion and urgency Srila Prabhupada said, 'My idea is to attract the people of the WHOLE world to Mayapur'. Now that time is fast approaching and the official date of the TOVP Grand Opening in 2022 is TO BE ANNOUNCED SHORTLY. We have less than four years to complete this monumental project, one which will change the course of human history for generations into the future by dispelling the darkness of ignorance in the world and opening the flood gates of Krishna consciousness to all human society. Time is of the essence and it's essential we all work and pray together cooperatively as a worldwide community to insure the TOVP is completed for the pleasure, glory and victory of Srila Prabhupada. This is our combined offering to him out of gratitude for the great eternal gift he has given to us, and we will all be blessed in the process of serving him, our acharyas and Lord Gauranga's holy place of Sridhama Mayapur.",
  lastDate: "Gaur Purnima, 2022",
  totalInstallment: 12,
  paidInstallments: 6,
};
var soldOutStatus = null;
const screenHeight = Dimensions.get("window").height;
export default class SingleCampaign extends React.Component {
  state = {
    animate: new Animated.Value(0),
    animateBottom: new Animated.Value(0),
    amountTxtInput: "$100.00",
    selectPayment: "",
    selected: false,
    data: [],
    modalVisibility: false,
  };
  componentDidMount() {
    this.getProducts();
    Animated.spring(this.state.animate, {
      toValue: 1,
      speed: 0.5,
    }).start();
  }
  getProducts = () => {
    fetch(apiUrl + "campaign/" + this.props.item._id)
      .then((res) => res.json())
      .then((resJson) => {
        console.log("po", resJson);
        this.setState({ data: resJson });
      })
      .catch((e) => console.log(e));
  };

  onPressDonate = (pos) => {
    if (pos == "up") {
      Animated.spring(this.state.animateBottom, {
        toValue: 1,
      }).start();
    } else if (pos == "down") {
      Animated.spring(this.state.animateBottom, {
        toValue: 0,
      }).start();
    }
  };
  selectPayment = (paymentMethod) => {
    this.setState({ selectPayment: paymentMethod, selected: true });
  };
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
        soldOutText: item.soldOutText,
      });
    }
  };
  onPressHelperFn = (item, index) => {
    let obj = {
      paymentController: this.props.paymentController,
      email: this.props.email,
      index: index,
      arr: this.state.data,
      userId: this.props.userId,
      pickerType: this.props.country,
      type: item.type,
      campaingFlag: true,
      country: this.props.country,
      campaignId: this.props.item._id,
      autoCaptureRazorPay: this.props.autoCaptureRazorPay,
    };
    let flagObj = {
      flagPaymentController: this.props.flagPaymentController,
      email: this.props.email,
      index: index,
      arr: this.state.data,
      pickerType: this.props.country,
      userId: this.props.userId,
      type: item.type,
      campaingFlag: true,
      country: this.props.country,
      campaignId: this.props.item._id,
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
  render() {
    var percent =
      ((100 / data.totalInstallment) * data.paidInstallments).toString() + "%";
    const animatedWidth = this.state.animate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", percent],
    });
    const animatedPosition = this.state.animateBottom.interpolate({
      inputRange: [0, 1],
      outputRange: [-(screenHeight / 2 + 20), 0],
    });
    console.log(this.state.data);
    return (
      <React.Fragment>
        {Platform.OS === "ios" ? (
          <View
            style={{
              height: getStatusBarHeight(true),
              width: "100%",
              backgroundColor: "#42aec2",
            }}
          ></View>
        ) : null}
        {Platform.OS === "ios" ? (
          <StatusBar backgroundColor="#007e92" barStyle="light-content" />
        ) : null}
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
                  {this.state.soldOutText}
                  has now been sponsored.
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity //.........................modalView
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
                  width: "85%",
                  height: screenHeight / 2 - 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  elevation: 20,
                }}
              >
                <View
                  style={{
                    flex: 2,
                    justifyContent: "flex-end",
                    paddingBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-Bold",
                      color: "#454545",
                      fontSize: widthPercentageToDP("3.5%"),
                      textAlign: "center",
                    }}
                  >
                    {this.state.modalTitle}
                  </Text>
                  <View
                    style={{
                      width: 60,
                      height: 20,
                      borderBottomWidth: 2,
                      borderBottomColor: "#42aec2",
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: "flex-end",
                    paddingBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat-Regular",
                      color: "#454545",
                      fontSize: widthPercentageToDP("3.3%"),
                    }}
                  >
                    Select your residency
                  </Text>
                </View>
                <View
                  style={{
                    flex: 4,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: widthPercentageToDP("3.5%"),
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: "42%",
                      height: "75%",
                      backgroundColor: "#fff",
                      borderRadius: 4,
                      elevation: 18,
                      marginRight: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                    }}
                    onPress={() => this.onPressBtn("india")}
                  >
                    <Image
                      source={require("../src/india.png")}
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        color: "#42aec2",
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: widthPercentageToDP("3.3%"),
                      }}
                    >
                      India
                    </Text>
                    <Text
                      style={{
                        color: "#454545",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.2%"),
                        textAlign: "center",
                      }}
                    >
                      For all Indian residents/citizens - please donate via this
                      page
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: "42%",
                      height: "75%",
                      backgroundColor: "#fff",
                      borderRadius: 4,
                      elevation: 18,
                      marginLeft: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                    }}
                    onPress={() => this.onPressBtn("international")}
                  >
                    <Image
                      source={require("../src/international.png")}
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        color: "#42aec2",
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: widthPercentageToDP("3.3%"),
                        textAlign: "center",
                      }}
                    >
                      INTERNATIONAL - ALL OTHERS
                    </Text>
                    <Text
                      style={{
                        color: "#454545",
                        fontFamily: "Montserrat-Regular",
                        fontSize: widthPercentageToDP("3.2%"),
                        textAlign: "center",
                      }}
                    >
                      For everyone else please use this page
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </Modal>
        <NavBar
          title="Campaigns"
          color="#42aec2"
          titleColor="#fff"
          noRightBtn={true}
          back={true}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 10 : 1,
            paddingLeft: widthPercentageToDP("3.5%"),
            paddingRight: widthPercentageToDP("3.5%"),
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              width: "100%",
              aspectRatio: 5 / 2.3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: this.props.item.imgs[0] }}
              style={{ width: "98%", height: "98%", borderRadius: 10 }}
            />
          </View>

          {/* ...............................................Title/Description */}
          <View
            style={{
              width: "100%",
              height: heightPercentageToDP("8%"),
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Bold",
                fontSize: widthPercentageToDP("3.5%"),
                color: "#454545",
              }}
            >
              {this.props.item.name}
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.2%"),
                color: "#42aec2",
              }}
            >
              Your devotion is our inspiration
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              paddingTop: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%"),
                paddingBottom: widthPercentageToDP(3),
                color: titleColor,
              }}
            >
              {this.props.item.description}
            </Text>
          </View>

          <View
            style={{
              width: "98%",
              height: 0.6,
              backgroundColor: "rgba(0,0,0,0.1)",
              alignSelf: "center",
            }}
          />
          <View //....................donate View
            style={{
              width: "100%",
              aspectRatio: 5 / 1,
              flexDirection: "row",
              paddingTop: widthPercentageToDP("3%"),
            }}
          >
            <View style={{ flex: 1.5 }}>
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: widthPercentageToDP("3.2%"),
                  color: "#a8a8a8",
                  paddingBottom: widthPercentageToDP(2),
                }}
              >
                Last date of the campaign
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: widthPercentageToDP("3.5%"),
                  color: "#454545",
                }}
              >
                {moment(this.props.item.dateOfExpiration).format("DD.MM.YYYY")}
              </Text>
            </View>
          </View>
          <View />
          {this.state.data
            ? this.state.data.map((item, index) => {
                let amount = 0;
                this.props.country == "India"
                  ? (amount = "₹ " + Number(item.amounts["INR"][0]).toFixed(2))
                  : (amount = "$ " + Number(item.amounts["USD"][0]).toFixed(2));
                console.log(item.amounts, amount);
                return (
                  <TouchableOpacity //....................donationList
                    key={index.toString()}
                    onPress={() => this.onPressBtn(item, index)}
                    style={{
                      width: "90%",
                      aspectRatio: 5.5 / 1,
                      borderRadius: 5,
                      elevation: 10,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      alignSelf: "center",
                      marginBottom: 12,
                      paddingLeft: 16,
                      paddingRight: 10,
                      backgroundColor: "#fff",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{ uri: item.imgs[0] }}
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: "contain",
                        }}
                      />
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
              })
            : null}
          <View style={{ width: "100%", height: 18 }} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
