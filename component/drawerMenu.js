import React, { Component } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import { ContextConsumer } from "./contextApi";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path, Defs, Stop, G, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-community/async-storage";
import { Actions } from "react-native-router-flux";
import I18n from "react-native-i18n";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  ProfileControllerProvider,
  ProfileControllerConsumer,
} from "./profileController";
import { apiUrl } from "./config";

var color = "#42aec2";
const vision = (
  <Svg width={18.649} height={20.62}>
    <G data-name="Group 8">
      <Path
        fill={color}
        d="M9.325 3.172a6.179 6.179 0 0 0-6.277 6.069 7.217 7.217 0 0 0 1.529 4.412 2.6 2.6 0 0 1 .625 1.284 2.623 2.623 0 0 0 1.171 2.084c.019.466.088 1.605.088 1.605.012.323.183.986 1.3 1.356a1.876 1.876 0 0 0 .512.5.793.793 0 0 0 .443.136H9.93a.784.784 0 0 0 .443-.136 1.864 1.864 0 0 0 .512-.5c1.124-.374 1.288-1.045 1.3-1.359 0 0 .068-1.137.087-1.6a2.624 2.624 0 0 0 1.176-2.09 2.6 2.6 0 0 1 .628-1.289 7.209 7.209 0 0 0 1.522-4.403 6.179 6.179 0 0 0-6.273-6.069zm3.432 9.583a3.823 3.823 0 0 0-.9 2.177 1.178 1.178 0 0 1-.594.855H7.387a1.177 1.177 0 0 1-.594-.855 3.84 3.84 0 0 0-.906-2.185 5.681 5.681 0 0 1-1.248-3.51 4.593 4.593 0 0 1 4.686-4.479 4.591 4.591 0 0 1 4.687 4.483 5.688 5.688 0 0 1-1.255 3.514z"
        data-name="Path 1172"
      />
      <Path
        fill={color}
        d="M9.325 1.983a.4.4 0 0 0 .4-.4V.4a.4.4 0 1 0-.794 0v1.186a.4.4 0 0 0 .394.397z"
        data-name="Path 1173"
      />
      <Path
        fill={color}
        d="M5.112 2.822a.4.4 0 1 0 .687-.4l-.595-1.03a.4.4 0 0 0-.687.4z"
        data-name="Path 1174"
      />
      <Path
        fill={color}
        d="M2.823 5.112l-1.03-.594a.4.4 0 0 0-.4.687l1.03.594a.4.4 0 0 0 .4-.687z"
        data-name="Path 1175"
      />
      <Path
        fill={color}
        d="M1.983 9.325a.4.4 0 0 0-.4-.4H.397a.4.4 0 1 0 0 .793h1.189a.4.4 0 0 0 .397-.393z"
        data-name="Path 1176"
      />
      <Path
        fill={color}
        d="M2.424 12.851l-1.031.594a.4.4 0 1 0 .4.687l1.031-.595a.4.4 0 1 0-.4-.687z"
        data-name="Path 1177"
      />
      <Path
        fill={color}
        d="M17.257 13.446l-1.03-.595a.4.4 0 1 0-.4.687l1.03.594a.4.4 0 1 0 .4-.686z"
        data-name="Path 1178"
      />
      <Path
        fill={color}
        d="M18.253 8.928h-1.188a.4.4 0 0 0 0 .793h1.189a.4.4 0 0 0 0-.793z"
        data-name="Path 1179"
      />
      <Path
        fill={color}
        d="M16.027 5.851a.393.393 0 0 0 .2-.053l1.031-.594a.4.4 0 1 0-.4-.687l-1.03.594a.4.4 0 0 0 .2.74z"
        data-name="Path 1180"
      />
      <Path
        fill={color}
        d="M12.995 2.969a.39.39 0 0 0 .2.054.4.4 0 0 0 .344-.2l.594-1.03a.4.4 0 1 0-.687-.4l-.594 1.03a.4.4 0 0 0 .143.546z"
        data-name="Path 1181"
      />
      <Path
        fill={color}
        d="M8.793 11.72c.048.351.218.448.532.448s.484-.1.532-.448l.375-2.828a4.784 4.784 0 0 0 .047-.568v-1.4a.955.955 0 0 0-1.91 0v1.4a4.7 4.7 0 0 0 .048.568z"
        data-name="Path 1182"
      />
      <Path
        fill={color}
        d="M9.324 12.952a.991.991 0 1 0 .991.991 1 1 0 0 0-.991-.991z"
        data-name="Path 1183"
      />
    </G>
  </Svg>
);
const donate = (
  <Svg width={14.034} height={21}>
    <Path
      fill={color}
      d="M12.383 6.461a.121.121 0 0 0-.119-.115h-10.5a.121.121 0 0 0-.118.115v2.826h10.732z"
      data-name="Path 1184"
    />
    <Path
      fill={color}
      d="M12.153 10.828a.3.3 0 0 1-.183-.288v-.633H2.063v.633a.3.3 0 0 1-.181.287A3.067 3.067 0 0 0 0 13.675v5.94a1.378 1.378 0 0 0 1.361 1.386h11.313a1.378 1.378 0 0 0 1.36-1.386v-5.939a3.051 3.051 0 0 0-1.881-2.848z"
      data-name="Path 1186"
    />
    <Path
      fill={color}
      d="M6.604.31V1.6a.31.31 0 0 0 .619 0V.31a.31.31 0 0 0-.619 0z"
      data-name="Path 1187"
    />
    <Path
      fill={color}
      d="M12.584 2.441a.31.31 0 0 0-.438 0l-.931.931a.31.31 0 0 0 .438.438l.931-.931a.31.31 0 0 0 0-.438z"
      data-name="Path 1188"
    />
    <Path
      fill={color}
      d="M1.425 2.452a.31.31 0 0 0 0 .438l.931.931a.31.31 0 1 0 .438-.438l-.931-.931a.31.31 0 0 0-.438 0z"
      data-name="Path 1189"
    />
    <Path
      fill={color}
      d="M4.155 2.448a.31.31 0 0 0 .565-.254l-.539-1.2a.31.31 0 1 0-.565.253z"
      data-name="Path 1190"
    />
    <Path
      fill={color}
      d="M9.8.662a.31.31 0 0 0-.4.179l-.468 1.231a.31.31 0 0 0 .579.22l.468-1.231A.31.31 0 0 0 9.8.662z"
      data-name="Path 1191"
    />
  </Svg>
);

const profile = (
  <Svg width={12.5} height={14.871}>
    <G transform="translate(-20.625)">
      <Circle
        fill={color}
        cx={3.448}
        cy={3.448}
        r={3.448}
        data-name="Ellipse 6"
        transform="translate(23.427)"
      />
      <Path
        fill={color}
        d="M26.875 8.621a6.25 6.25 0 0 0-6.25 6.25h12.5a6.25 6.25 0 0 0-6.25-6.25z"
        data-name="Path 1192"
      />
    </G>
  </Svg>
);

const notification = (
  <Svg width={19.85} height={22.621}>
    <G data-name="Group 11">
      <G data-name="Group 10">
        <Path
          fill={color} //"#fd4968"
          d="M13.801 14.019l-1.189-1.982a5.888 5.888 0 0 1-.839-3.029V7.272A4.854 4.854 0 0 0 8.31 2.628V1.385a1.385 1.385 0 0 0-2.77 0v1.243a4.854 4.854 0 0 0-3.463 4.644v1.736a5.891 5.891 0 0 1-.839 3.029L.049 14.019a.347.347 0 0 0 .3.525h13.155a.346.346 0 0 0 .3-.524z"
          data-name="Path 1193"
        />
      </G>
    </G>
    <G data-name="Group 13">
      <G data-name="Group 12">
        <Path
          fill={color} //"#fd4968"
          d="M4.744 15.236a2.409 2.409 0 0 0 4.362 0z"
          data-name="Path 1194"
        />
      </G>
    </G>
  </Svg>
);

const listData = [
  { name: "vision", svgName: vision, svg: true, actionName: "vision" },
  { name: "aboutUs", iconName: "users", actionName: "aboutUs" },
  {
    name: "donateNow",
    svgName: donate,
    svg: true,
    actionName: "donate",
  },
  {
    name: "campaigns",
    // svgName: campaign,
    // svg: true,
    image: true,
    imageRequire: require("../src/campaign.png"),
    actionName: "campaign",
  },
  {
    name: "myProfile",
    svgName: profile,
    svg: true,
    actionName: "profile",
  },
  {
    name: "shareYourBhakti",
    iconName: "share-2",
    actionName: "shareBhakti",
  },
  {
    name: "redeemPoints",
    image: true,
    imageRequire: require("../src/wallet.png"),
    actionName: "shareBhaktiBazzar",
  },
  {
    name: "notification",
    svgName: notification,
    svg: true,
    actionName: "notificationList",
  },
  { name: "faq", iconName: "message-circle", actionName: "faq" },
  { name: "contactUs", iconName: "phone-call", actionName: "contactUs" },
  { name: "legal", iconName: "clipboard", actionName: "legal" },
  { name: "logOut", iconName: "log-out", actionName: "logOut" },
];
export default class DrawerMenu extends Component {
  state = {
    webviewData: null,
  };

  componentDidMount() {
    this.value.getProfileInfo(this.props.userId);
    this.checkWebview();
  }

  checkWebview = () => {
    //let url = "https://gentle-reef-30804.herokuapp.com/webview";
    let url = `${apiUrl}webview`;
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        this.setState({ webviewData: resJson });
      })
      .catch((e) => console.log(e));
  };

  onPressRender = (itemAction) => {
    if (Actions.currentScene == itemAction) {
      Actions.drawerClose();
    } else {
      Actions.replace(itemAction);
    }
  };

  flatListRenderItem = ({ item }) => (
    <ContextConsumer>
      {(value) => (
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            height: heightPercentageToDP("8%"),
            flexDirection: "row",
            borderBottomColor: "grey",
            borderBottomWidth: 0.3,
            marginLeft: 8,
            marginRight: 8,
          }}
          onPress={() => {
            if (item.actionName == "logOut") {
              value.logOut();
              this.props.logOut();
            } else {
              this.onPressRender(item.actionName);
            }
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {item.svg ? (
              item.svgName
            ) : item.image ? (
              <Image
                source={item.imageRequire}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            ) : (
              <Icon name={item.iconName} color="#42aec2" size={20} />
            )}
          </View>
          <View
            style={{
              flex: 3.5,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-SemiBold",
                color: "#42aec2",
                fontSize: widthPercentageToDP("3.2%"),
              }}
            >
              {I18n.t(item.name)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </ContextConsumer>
  );

  newsTab = () => (
    <TouchableOpacity //...........news
      style={{
        width: "100%",
        alignSelf: "center",
        height: heightPercentageToDP("7%"),
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.3)",
        borderBottomColor: "grey",
        borderBottomWidth: 0.3,
        marginLeft: 8,
        marginRight: 8,
      }}
      onPress={() => {
        this.onPressRender("news");
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Icon name="radio" color="#383c7c" size={20} />
      </View>
      <View
        style={{
          flex: 3.5,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat-SemiBold",
            color: "#383c7c",
            fontSize: widthPercentageToDP("3.2%"),
          }}
        >
          {I18n.t("news")}
        </Text>
      </View>
      <View
        style={{
          flex: 1.5,
          backgroundColor: "#383c7c",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="external-link" color="#fff" size={20} />
      </View>
    </TouchableOpacity>
  );

  customWebviewTab = () => (
    <TouchableOpacity
      style={{
        width: "90%",
        alignSelf: "center",
        height: heightPercentageToDP("8%"),
        flexDirection: "row",
        borderBottomColor: "grey",
        borderBottomWidth: 0.3,
        marginLeft: 8,
        marginRight: 8,
      }}
      onPress={() => {
        if (Actions.currentScene == "customWebview") {
          Actions.drawerClose();
        } else {
          Actions.replace("customWebview", {
            data: this.state.webviewData,
            userId: this.props.userId,
          });
        }
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: this.state.webviewData.img }}
          style={{ width: 20, height: 20, resizeMode: "contain" }}
        />
      </View>
      <View
        style={{
          flex: 3.5,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: "Montserrat-SemiBold",
            color: "#42aec2",
            fontSize: widthPercentageToDP("3.2%"),
          }}
        >
          {this.state.webviewData.menuTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ProfileControllerConsumer>
          {(value) => {
            this.value = value;
            return (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 5 / 3,
                  backgroundColor: "rgba(255,255,255,0.4)",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: 5,
                    width: "100%",
                    height: "50%",
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
                        width: 70,
                        height: 70,
                        borderRadius: 75,
                        borderWidth: 2,
                        borderColor: "#42aec2",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {value.profilePic ? (
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 65,
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            source={{
                              uri: value.profilePic,
                            }}
                            style={{
                              width: 60,
                              height: 60,
                            }}
                          />
                        </View>
                      ) : (
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 65,
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            source={require("../src/user.png")}
                            style={{
                              width: 60,
                              height: 60,
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 18,
                    }}
                  >
                    <Text
                      style={{
                        color: "#42aec2",
                        fontSize: widthPercentageToDP("3.5%"),
                        fontFamily: "Montserrat-SemiBold",
                        textTransform: "capitalize",
                      }}
                    >
                      {value.name}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        </ProfileControllerConsumer>
        {this.newsTab()}

        <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.4)" }}>
          <FlatList
            style={{ flex: 1 }}
            data={listData}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
              if (this.state.webviewData) {
                return this.customWebviewTab();
              } else {
                return null;
              }
            }}
            ListFooterComponent={() => (
              <ContextConsumer>
                {(value) => {
                  let lang;
                  AsyncStorage.getItem("appLanguage").then((appLanguage) => {
                    if (appLanguage == "russian") {
                      lang = "english";
                    } else if (appLanguage == "english") {
                      lang = "russian";
                    }
                  });
                  return (
                    // <TouchableOpacity onPress={() => value.toggle(lang)}>
                    //   <Text>Toogle</Text>
                    // </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: "90%",
                        alignSelf: "center",
                        height: heightPercentageToDP("8%"),
                        flexDirection: "row",
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.3,
                        marginLeft: 8,
                        marginRight: 8,
                      }}
                      onPress={() => value.toggle(lang)}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Icon name="toggle-right" color="#42aec2" size={20} />
                      </View>
                      <View
                        style={{
                          flex: 3.5,
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-SemiBold",
                            color: "#42aec2",
                            fontSize: widthPercentageToDP("3.2%"),
                          }}
                        >
                          {I18n.t("langToogle")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              </ContextConsumer>
            )}
            renderItem={this.flatListRenderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}
