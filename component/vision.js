import React from "react";
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import NavBar from "./navBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import HorizontalSwip from "./horizontalSwip";
import I18n from "react-native-i18n";
import ReadMoreModal from "./readMoreModal";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import moment from "moment";
import { primaryColor, titleColor, paraColor } from "../component/config";
import Toast from "react-native-simple-toast";
import VisionTopSwip from "./visionTopSwip";
import VisionTimer from "./visionTimer";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const data = [
  {
    title: "horizontalSwipe1",
    color: ["#fb6d64", "#fd4968"],
  },
  {
    title: "horizontalSwipe2",
    color: ["#fbd789", "#f38a81"],
  },
  {
    title: "horizontalSwipe3",
    color: ["#fb6d64", "#fd4968"],
  },
];
const modalData = [
  {
    para: "para1",
    pic: require("../src/v1.jpg"),
  },
  {
    para: "para2",
    pic: require("../src/v2.jpg"),
  },
  {
    para: "para3",
    pic: require("../src/v3.jpg"),
  },
  {
    para: "para4",
    pic: require("../src/v4.jpg"),
  },
];

export default class Vision extends React.Component {
  state = {
    modalDataIndex: 0,
    modalVisible: false,
  };

  render() {
    return (
      <React.Fragment>
        <Modal //...............readmore
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View
            style={{
              width: screenWidth,
              height: screenHeight,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
            //onPress={() => this.setState({ modalVisible: false })}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "95%",
                height: heightPercentageToDP("80%"),
                borderRadius: 10,
              }}
            >
              <ReadMoreModal
                data={modalData[this.state.modalDataIndex]}
                closeModal={() => this.setState({ modalVisible: false })}
              />
            </View>
          </View>
        </Modal>
        <StatusBar backgroundColor="#007e92" barStyle={"light-content"} />
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <VisionTopSwip userId={this.props.userId} />
          <View
            style={{ width: "90%", aspectRatio: 5 / 4, alignSelf: "center" }}
          >
            <View
              style={{ width: "70%", height: 80, justifyContent: "center" }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: widthPercentageToDP("5%"),
                  color: titleColor, //"#707070",
                }}
              >
                {I18n.t("visionh1")}
              </Text>
            </View>
            <View
              style={{ width: "10%", height: 3, backgroundColor: primaryColor }}
            />
            <View style={{ flex: 1, paddingTop: 5, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: widthPercentageToDP("3%"),
                  color: paraColor,
                }}
              >
                {I18n.t("visionpara1")}
              </Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <Image
                source={require("../src/quotes2.png")}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>
          </View>
          <View //........................timer
            style={{
              width: "100%",
              paddingTop: widthPercentageToDP(3),
            }}
          >
            <VisionTimer />
          </View>
          <View //,.................................v1
            style={{
              width: "100%",
              height: heightPercentageToDP("35%"),
              paddingTop: 10,
              paddingLeft: 10,
            }}
          >
            <View style={{ flex: 0.4, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: widthPercentageToDP("4%"),
                  fontFamily: "Montserrat-Bold",
                  color: titleColor, //"#707070",
                }}
              >
                {I18n.t("founderVision")}
              </Text>
            </View>
            <View style={{ flex: 2, flexDirection: "row" }}>
              <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                <Image
                  source={require("../src/v1.jpg")}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View style={{ flex: 3, padding: 10 }}>
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3%"),
                    fontFamily: "Montserrat-Regular",
                    color: paraColor,
                  }}
                  numberOfLines={Math.floor(heightPercentageToDP("1.43%"))}
                >
                  {I18n.t("para1")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalDataIndex: 0, modalVisible: true });
                  }}
                >
                  <Text
                    style={{
                      color: primaryColor,
                      fontSize: 12,
                      paddingTop: 10,
                    }}
                  >
                    {I18n.t("readMore")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View //................................v2
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingRight: 10,
            }}
          >
            <View style={{ flex: 2, flexDirection: "row" }}>
              <View style={{ flex: 1.3, padding: 10 }}>
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3%"),
                    fontFamily: "Montserrat-Regular",
                    color: paraColor,
                  }}
                  numberOfLines={8}
                >
                  {I18n.t("para2")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalDataIndex: 1, modalVisible: true });
                  }}
                >
                  <Text style={{ color: primaryColor, fontSize: 12 }}>
                    {I18n.t("readMore")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Image
                  source={require("../src/v2.jpg")}
                  style={{ width: "100%", height: "85%" }}
                />
                <Text
                  style={{
                    fontSize: widthPercentageToDP("2.5%"),
                    color: titleColor,
                    fontFamily: "Montserrat-SemiBold",
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {I18n.t("picTitle1")}
                </Text>
              </View>
            </View>
          </View>
          <View //.......................horiSwip
            style={{
              width: "100%",
              aspectRatio: 5 / 1.3,
              margin: 8,
            }}
          >
            <HorizontalSwip data={data} />
          </View>
          <View //...........................temple2
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              padding: 10,
            }}
          >
            <Image
              source={require("../src/temple2.jpg")}
              style={{
                width: "98%",
                height: "100%",
                resizeMode: "cover",
                alignSelf: "center",
              }}
            />
          </View>
          <View //...........................................black 7 white
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingRight: 10,
            }}
          >
            <View style={{ flex: 2, flexDirection: "row" }}>
              <View style={{ flex: 1.3, padding: 10 }}>
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3%"),
                    fontFamily: "Montserrat-Regular",
                    color: paraColor,
                  }}
                  numberOfLines={8}
                >
                  {I18n.t("para3")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalDataIndex: 2, modalVisible: true });
                  }}
                >
                  <Text style={{ color: primaryColor, fontSize: 12 }}>
                    {I18n.t("readMore")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Image
                  source={require("../src/v3.jpg")}
                  style={{ width: "100%", height: "85%" }}
                />
                <Text
                  style={{
                    fontSize: widthPercentageToDP("2.5%"),
                    color: titleColor,
                    fontFamily: "Montserrat-SemiBold",
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {I18n.t("picTitle2")}
                </Text>
              </View>
            </View>
          </View>
          <View //............................................alfred
            style={{
              width: "100%",
              aspectRatio: 5 / 2.5,
              paddingTop: 10,
              paddingLeft: 10,
            }}
          >
            <View style={{ flex: 2, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Image
                  source={require("../src/v4.jpg")}
                  style={{ width: "100%", height: "85%" }}
                />
                <Text
                  style={{
                    fontSize: widthPercentageToDP("2.5%"),
                    color: titleColor,
                    fontFamily: "Montserrat-SemiBold",
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {I18n.t("picTitle3")}
                </Text>
              </View>
              <View style={{ flex: 1.3, padding: 10 }}>
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3%"),
                    fontFamily: "Montserrat-Regular",
                    color: paraColor,
                  }}
                  numberOfLines={8}
                >
                  {I18n.t("para4")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalDataIndex: 3, modalVisible: true });
                  }}
                >
                  <Text style={{ color: primaryColor, fontSize: 12 }}>
                    {I18n.t("readMore")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View //............................................last text
            style={{
              width: "100%",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: widthPercentageToDP("3%"),
                fontFamily: "Montserrat-Regular",
                color: paraColor,
              }}
              //numberOfLines={9}
            >
              {I18n.t("para5")}
            </Text>
          </View>
          <View style={{ width: "100%", height: 8 }} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
