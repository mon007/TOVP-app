import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  Button,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
  FlatList
} from "react-native";
import NavBar from "./navBar";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import I18n from "react-native-i18n";
import moment from "moment";
import {
  heightPercentageToDP,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { apiUrl } from "./config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Actions } from "react-native-router-flux";

var timer;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const pujaArr = [
  {
    pic: require("../src/NarasimhaMayapur.jpg"),
    title: "Sri Sri Nrisimha Dev Seva Puja"
  },
  {
    pic: require("../src/madhava.jpg"),
    title: "Sri Sri Radha Madhav Seva Puja"
  },
  { pic: require("../src/pancha.jpg"), title: "Sri Sri Pancatattva Seva Puja" }
];
export default class ShareBhaktiBazzar extends React.Component {
  state = {
    wallet: "",
    flatListData: [],
    allPuja: [],
    flatListRefresh: false
  };
  componentDidMount() {
    this.getProfileInfo();
    this.getSevaHistory();
    timer = setInterval(this.getSevaHistory, 1000);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          wallet: resJson.referrInfo.wallet
        });
      })
      .catch(e => console.log(e));
  };
  getSevaHistory = () => {
    url = apiUrl + "seva/history/" + this.props.userId;
    fetch(url)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.length > this.state.flatListData.length) {
          this.getProfileInfo();
          this.setState({
            flatListData: resJson,
            flatListRefresh: !this.state.flatListRefresh
          });
        }
      })
      .catch(e => console.log(e));
  };
  onRefresh = () => {
    this.setState({ flatListRefresh: true });
    this.getSevaHistory();
  };
  getAllPujaDetails = () => {
    let url = apiUrl + "seva/all";
    fetch(url)
      .then(res => res.json())
      .then(resJson => {
        if (resJson) {
          this.setState({ allPuja: resJson[0], refresh: !this.state.refresh });
        }
      })
      .catch(e => console.log(e));
  };

  flatListRenderView = ({ item, index }) => (
    <View
      key={index}
      style={{
        width: "100%",
        aspectRatio: 5 / 1.3,
        backgroundColor: "rgba(209,209,209,0.19)"
      }}
    >
      <View style={{ flex: 1 }}>
        <View //puja Name
          style={{
            width: "90%",
            height: "100%",
            alignSelf: "center",
            justifyContent: "flex-end",
            alignItems: "flex-start"
          }}
        >
          <Text
            style={{
              color: "#454545",
              textAlign: "center",
              fontFamily: "Montserrat-SemiBold",
              fontSize: widthPercentageToDP("3.4%"),
              paddingLeft: 4
            }}
          >
            {item.pujaName}
          </Text>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <View
          style={{
            width: "90%",
            height: "100%",
            alignSelf: "center",
            flexDirection: "row"
          }}
        >
          <View //Date of Puja & date
            style={{
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "flex-start"
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.2%")
              }}
            >
              Puja for: {item.name}
            </Text>
            <Text
              style={{
                color: "#42aec2",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.1%")
              }}
            >
              Date of Puja: {moment(item.dateOfPuja).format("DD.MM.YYYY")}
            </Text>
          </View>
          <View //point & piad on
            style={{
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "flex-end"
            }}
          >
            <Text
              style={{
                color: "#42aec2",
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("3.4%")
              }}
            >
              {item.points}
            </Text>
            <Text
              style={{
                color: "#a2a2a2",
                fontFamily: "Montserrat-Regular",
                fontSize: widthPercentageToDP("3.1%")
              }}
            >
              Paid on {moment(item.dateOfPayment).format("DD.MM.YYYY")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#fff", flex: 1 }}
      >
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
          title={I18n.t("redeemPoints")}
          noRightBtn={true}
          color="#42aec2"
          titleColor="white"
        />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#0cb5fc", "#19b99a"]}
          style={{
            width: "100%",
            aspectRatio: 5 / 3,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: "100%",
              height: 60,
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingLeft: 12,
              paddingRight: 12
            }}
          >
            <View style={{ paddingBottom: 10 }}>
              <Text
                style={{
                  color: "#56f9fb",
                  fontSize: widthPercentageToDP("3.1%"),
                  fontFamily: "Montserrat-SemiBold"
                }}
              >
                Total Points
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: widthPercentageToDP("8%"),
                fontFamily: "Montserrat-SemiBold"
              }}
            >
              {this.state.wallet}
            </Text>
            <View style={{ paddingTop: 12 }}>
              <Text
                style={{
                  color: "#e0ffffff",
                  fontSize: widthPercentageToDP("3%"),
                  fontFamily: "Montserrat-SemiBold",
                  textAlign: "center"
                }}
              >
                {I18n.t("share300")}
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View
          style={{
            width: "100%",
            aspectRatio: 5 / 2,
            justifyContent: "flex-end"
          }}
        >
          <View //.......................absolute View
            style={{
              //backgroundColor: "#fff",
              width: "90%",
              height: screenHeight / 4.5,
              alignSelf: "center",
              position: "absolute",
              top: -50,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            {pujaArr.map(item => (
              <View //.......................absolute View
                style={{
                  backgroundColor: "#fff",
                  width: screenWidth / 3 - widthPercentageToDP("8%"),
                  height: "100%",
                  borderRadius: 2,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 1
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
                      width: widthPercentageToDP("12%"),
                      height: widthPercentageToDP("12%"),
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
                      source={item.pic}
                    />
                  </View>
                </View>
                <View //.......title
                  style={{
                    flex: 1.5,
                    paddingLeft: 2,
                    paddingRight: 2,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#3e3b3b",
                      textAlign: "center",
                      fontFamily: "Montserrat-Regular",
                      fontSize: widthPercentageToDP("2.5%")
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
                <View //........button
                  style={{
                    flex: 0.8,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      //console.log(this.state.allPuja[item.title]);
                      Actions.push("sevaPujaList", {
                        item: {
                          title: item.title,
                          userId: this.props.userId,
                          getSevaHistory: this.getSevaHistory
                        }
                      });
                    }}
                    style={{
                      width: "60%",
                      height: 20,
                      borderRadius: 2,
                      elevation: 5,
                      backgroundColor: "#19b99a",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: widthPercentageToDP("3.1%"),
                        fontFamily: "Montserrat-SemiBold",
                        textTransform: "uppercase"
                      }}
                    >
                      Book
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              width: "90%",
              heigth: 20,
              flexDirection: "row",
              alignItems: "flex-start",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("../src/information.png")}
              style={{
                width: 10,
                height: 10,
                resizeMode: "contain",
                alignSelf: "center"
              }}
            />
            <Text
              style={{
                color: "#454545",
                paddingLeft: 4,
                fontFamily: "Montserrat-SemiBold",
                fontSize: widthPercentageToDP("2.9%")
              }}
            >
              Points are not transferrable to any other account or wallet
            </Text>
          </View>
        </View>

        <FlatList
          extraData={this.state.flatListRefresh}
          data={this.state.flatListData}
          style={{ flex: 1, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                height: 28,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 14
                //backgroundColor: "red"
              }}
            >
              <Image
                source={require("../src/history.png")}
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: "contain"
                }}
              />
              <Text
                style={{
                  color: "#454545",
                  textAlign: "center",
                  fontFamily: "Montserrat-Bold",
                  fontSize: 18,
                  paddingLeft: 4
                }}
              >
                SEVA HISTORY
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderTopWidth: 0.2,
                paddingTop: 10
              }}
            >
              <Text
                style={{
                  fontFamily: "MontSerrat-Regular",
                  fontSize: 12,
                  color: "#010101"
                }}
              >
                No Seva History
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{ width: "100%", height: 8, backgroundColor: "#fff" }}
            />
          )}
          renderItem={this.flatListRenderView}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={{ width: "100%", height: 18 }} />
      </ScrollView>
    );
  }
}
