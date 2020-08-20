import React from "react";
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Animated,
  PermissionsAndroid,
  Picker,
  Platform,
  Keyboard,
  Modal,
} from "react-native";
import NavBar from "./navBar";
import Toast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/dist/Feather";
import { Actions } from "react-native-router-flux";
import I18n from "react-native-i18n";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import IOSPicker from "react-native-ios-picker";
import {
  ProfileControllerProvider,
  ProfileControllerConsumer,
} from "./profileController";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import { apiUrl, primaryColor } from "./config";
import ProfileUpdateModal from "./emailPasswordUpdate";

const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const screenHeight = Dimensions.get("window").height;
const navBarHeight = heightPercentageToDP(8);
var called = false;
const options = {
  title: "Select Avatar",
  customButtons: [{ name: "Tovp", title: "Choose Photo from Gallery" }],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};
const panRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const sceneKey = [
  "singleBrickView",
  "singleTitleView",
  "singleSquareFootView",
  "victoryFlag",
  "generalDonation",
  "singleCoinView",
  "singlePillarView",
];

export default class Profile extends React.Component {
  state = {
    edit: false,
    name: "",
    email: "",
    phone: "",
    continent: "",
    pinCodeCheck: true,
    pinCode: "",
    userState: "Select your State",
    city: "Select your City",
    avatarSource: "",
    editProfile: false,
    imagePicked: false,
    stateArr: [],
    cityArr: [],
    countryId: "",
    country: "",
    panNumberValidation: true,
    panNumber: "",
    panNumberSubmitted: false,
    address: "",
    // landmark: "",
    keyboardViewHeight: 0,
    modalVisibility: false,
    modalData: "email",
  };
  onEditPress = () => {
    this.setState({ edit: !this.state.edit });
  };
  componentDidMount = () => {
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.getProfileInfo();
    if (Platform.OS == "android") {
      for (let i = 0; i < sceneKey.length; i++) {
        if (Actions.prevScene == sceneKey[i]) {
          this.onEditPress();
          break;
        }
      }
    }
  };

  getStates = (countryId) => {
    fetch(apiUrl + "data/states/" + countryId)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          let stateArr = [].concat(this.state.stateArr);
          for (i = 0; i < resJson.length; i++) {
            resJson.sort((a, b) => {
              if (a["stateName"] > b["stateName"]) {
                return 1;
              } else {
                return -1;
              }
            });
          }
          stateArr = resJson;
          console.log(stateArr);
          if (this.state.userState == "Select your State") {
            this.getCities(resJson[0]["stateID"]);
            stateArr.unshift({ stateName: "Select your State" });
            this.setState({ stateArr, userState: "Select your State" });
            //this.setState({ stateArr, userState: "Select your State" });
          } else {
            this.setState({ stateArr });
            for (i = 0; i < resJson.length; i++) {
              if (this.state.userState == resJson[i]["stateName"]) {
                this.getCities(resJson[i]["stateID"]);
                break;
              }
            }
          }
        }
      });
  };

  getCities = (stateId, fromStatePicker) => {
    fetch(apiUrl + "data/cities/" + stateId)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          for (i = 0; i < resJson.length; i++) {
            resJson.sort((a, b) => {
              if (a > b) {
                return 1;
              } else {
                return -1;
              }
            });
          }
          console.log(resJson);
          if (this.state.city == "Select your City") {
            resJson.unshift("Select your City");

            this.setState({ cityArr: resJson, city: "Select your City" });
          } else if (fromStatePicker) {
            this.setState({ cityArr: resJson, city: resJson[0] });
          } else {
            this.setState({ cityArr: resJson });
          }
        }
      });
  };

  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          this.setState({
            name: resJson.legalName,
            email: resJson.email,
            phone: resJson.phone,
            city: resJson.city || "Select your City",
            continent: resJson.continent,
            userState: resJson.state || "Select your State",
            pinCode: resJson.pinCode,
            avatarSource: resJson.avatar,
            countryId: resJson.countryId,
            country: resJson.country,
            panNumber: resJson.panNo,
            panNumberSubmitted: resJson.panNumberSubmitted,
            address: resJson.address,
            // landmark: resJson.landmark,
          });
          this.getStates(resJson.countryId);
        }
      })
      .catch((e) => console.log(e));
  };

  _keyboardDidShow = (e) => {
    this.setState({ keyboardViewHeight: e.endCoordinates.height + 18 });
  };

  _keyboardDidHide = (e) => {
    this.setState({ keyboardViewHeight: 0 });
  };

  //onProfilePic edit button pressed
  onProfilePicEdit = () => {
    if (Platform.OS === "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then((result) => {
        if (
          result["android.permission.CAMERA"] &&
          result["android.permission.READ_EXTERNAL_STORAGE"] &&
          result["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted"
        ) {
          ImagePicker.launchImageLibrary(options, (response) => {
            // console.log(response);
            // console.log("Response = ", response);
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
              console.log("User tapped custom button: ", response.customButton);
            } else {
              const source = { uri: response.uri };
              ImageResizer.createResizedImage(source.uri, 500, 500, "JPEG", 50)
                .then((response) => {
                  let data = new FormData();
                  if (response) {
                    data.append("avatar", {
                      name: "avatar",
                      type: "image/jpeg",
                      uri:
                        Platform.OS === "android"
                          ? response.uri
                          : response.uri.replace("file://", ""),
                    });

                    fetch(apiUrl + "user/avatar/" + this.props.userId, {
                      method: "POST",
                      headers: {
                        authorization:
                          "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                      },
                      body: data,
                    })
                      .then((res) => {
                        let data11 = res.json();
                        let status11 = res.status;
                        //console.log(res);
                        return Promise.all([data11, status11]);
                      })
                      .then(([data11, status11]) => {
                        if (status11 == 200) {
                          Toast.show("Profile Pic Updated", Toast.LONG);
                          this.value.updateProfilePic(response.uri);
                          this.setState({
                            avatarSource: response.uri,
                            imagePicked: true,
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        } else if (
          result["android.permission.CAMERA"] ||
          result["android.permission.READ_EXTERNAL_STORAGE"] ||
          result["android.permission.WRITE_EXTERNAL_STORAGE"] === "denied"
        ) {
          Toast.show("Permissions denied", Toast.LONG);
        } else if (
          result["android.permission.CAMERA"] ||
          result["android.permission.READ_EXTERNAL_STORAGE"] ||
          result["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            "never_ask_again"
        ) {
          Toast.show(
            "Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue",
            Toast.LONG
          );
        }
      });
    } //...........................ios
    else {
      ImagePicker.launchImageLibrary(options, (response) => {
        // console.log(response);
        // console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          const source = { uri: response.uri };
          ImageResizer.createResizedImage(source.uri, 500, 500, "JPEG", 50)
            .then((response) => {
              let data = new FormData();
              if (response) {
                data.append("avatar", {
                  name: "avatar",
                  type: "image/jpeg",
                  uri:
                    Platform.OS === "android"
                      ? response.uri
                      : response.uri.replace("file://", ""),
                });

                fetch(apiUrl + "user/avatar/" + this.props.userId, {
                  method: "POST",
                  headers: {
                    authorization:
                      "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                  },
                  body: data,
                })
                  .then((res) => {
                    let data11 = res.json();
                    let status11 = res.status;
                    //console.log(res);
                    return Promise.all([data11, status11]);
                  })
                  .then(([data11, status11]) => {
                    if (status11 == 200) {
                      Toast.show("Profile Pic Updated", Toast.LONG);
                      this.value.updateProfilePic(response.uri);
                      this.setState({
                        avatarSource: response.uri,
                        imagePicked: true,
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  //called when update button is pressed on edit
  onEmailPhoneUpdate = (modalData) => {
    this.setState({ modalData, modalVisibility: true });
  };

  hideModal = () => {
    this.setState({ modalVisibility: false });
  };

  updateStateEmailPhone = () => {
    this.getProfileInfo();
    this.value.getProfileInfo(this.props.userId);
  };

  render() {
    return (
      <ProfileControllerConsumer>
        {(value) => {
          this.value = value;
          if (!called) {
            value.getProfileInfo(this.props.userId);
            called = true;
          }
          return (
            <React.Fragment>
              <Modal
                visible={this.state.modalVisibility}
                onRequestClose={this.hideModal}
                transparent={true}
                animationType="fade"
              >
                {this.state.modalVisibility ? (
                  <ProfileUpdateModal
                    modalData={this.state.modalData}
                    email={this.state.email}
                    phone={this.state.phone}
                    country={this.props.country}
                    continent={this.state.continent}
                    hideModal={this.hideModal}
                    userId={this.props.userId}
                    getProfileInfo={this.updateStateEmailPhone}
                  />
                ) : null}
              </Modal>
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
                      aspectRatio: 5 / 2.8,
                    }}
                  ></LinearGradient>
                </View>
              ) : null}

              <StatusBar backgroundColor="#007e92" barStyle="light-content" />

              <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
                <LinearGradient //...........................topContainer
                  colors={["#42aec2", "#007e92"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: "100%",
                    aspectRatio: 5 / 2.8,
                  }}
                >
                  <ImageBackground
                    source={require("../src/tovp_bg_10.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    imageStyle={{ resizeMode: "cover" }}
                  >
                    <View //.........................................NavBar
                      style={{
                        height: navBarHeight,
                        width: "100%",
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
                        <Icon name="menu" size={18} color="#fff" />
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
                            color: "#fff",
                            fontSize: widthPercentageToDP("4.5%"),
                            textTransform: "uppercase",
                          }}
                        >
                          {I18n.t("profile")}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => this.onEditPress()}
                        style={{
                          flex: 1.5,
                          // backgroundColor: "red",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          paddingRight: widthPercentageToDP(5),
                          //flexDirection: "row",
                        }}
                      >
                        {this.state.edit ? (
                          <Icon
                            name="x"
                            size={widthPercentageToDP(5)}
                            color="#fff"
                          />
                        ) : (
                          //  <Image
                          //   source={require("../src/edit.png")}
                          //   style={{
                          //     width: widthPercentageToDP("3%"),
                          //     height: widthPercentageToDP("3%"),
                          //     resizeMode: "contain",
                          //     paddingRight: 10,
                          //   }}
                          // />
                          <Icon
                            name="edit"
                            size={widthPercentageToDP(5)}
                            color="#fff"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View //.....................profileImage
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 90,
                          borderWidth: 2,
                          borderColor: "white",
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {this.state.avatarSource ? (
                          <View
                            style={{
                              width: 65,
                              height: 65,
                              borderRadius: 85,
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <ImageBackground
                              style={{
                                width: 65,
                                height: 65,
                              }}
                              source={{
                                uri: this.state.avatarSource,
                              }}
                            >
                              {this.state.edit ? (
                                <TouchableOpacity //..........................absoluteCamera
                                  style={{
                                    flex: 1,
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onPress={this.onProfilePicEdit}
                                >
                                  <View
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 30,
                                      backgroundColor: "#42aec2",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: 14,
                                        height: 14,
                                        resizeMode: "contain",
                                      }}
                                      source={require("../src/photo_camera.png")}
                                    />
                                  </View>
                                </TouchableOpacity>
                              ) : null}
                            </ImageBackground>
                          </View>
                        ) : (
                          <View
                            style={{
                              width: 65,
                              height: 65,
                              borderRadius: 85,
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <ImageBackground
                              style={{ width: 65, height: 65 }}
                              source={require("../src/user.png")}
                            >
                              {this.state.edit ? (
                                <TouchableOpacity //..........................absoluteCamera
                                  style={{
                                    flex: 1,
                                    backgroundColor: "rgba(255,255,255,0.4)",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onPress={this.onProfilePicEdit}
                                >
                                  <View
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 30,
                                      backgroundColor: "#42aec2",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Image
                                      style={{
                                        width: 14,
                                        height: 14,
                                        resizeMode: "contain",
                                      }}
                                      source={require("../src/photo_camera.png")}
                                    />
                                  </View>
                                </TouchableOpacity>
                              ) : null}
                            </ImageBackground>
                          </View>
                        )}
                        {/* {this.state.edit ? (
                          <TouchableOpacity //..........................absoluteCamera
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 30,
                              backgroundColor: "#42aec2",
                              position: "absolute",
                              right: -1,
                              justifyContent: "center",
                              alignItems: "center",
                              bottom: -1,
                            }}
                            onPress={() => {
                              if (Platform.OS === "android") {
                                PermissionsAndroid.requestMultiple([
                                  PermissionsAndroid.PERMISSIONS.CAMERA,
                                  PermissionsAndroid.PERMISSIONS
                                    .READ_EXTERNAL_STORAGE,
                                  PermissionsAndroid.PERMISSIONS
                                    .WRITE_EXTERNAL_STORAGE,
                                ]).then((result) => {
                                  if (
                                    result["android.permission.CAMERA"] &&
                                    result[
                                      "android.permission.READ_EXTERNAL_STORAGE"
                                    ] &&
                                    result[
                                      "android.permission.WRITE_EXTERNAL_STORAGE"
                                    ] === "granted"
                                  ) {
                                    ImagePicker.launchImageLibrary(
                                      options,
                                      (response) => {
                                        // console.log(response);
                                        // console.log("Response = ", response);
                                        if (response.didCancel) {
                                          console.log(
                                            "User cancelled image picker"
                                          );
                                        } else if (response.error) {
                                          console.log(
                                            "ImagePicker Error: ",
                                            response.error
                                          );
                                        } else if (response.customButton) {
                                          console.log(
                                            "User tapped custom button: ",
                                            response.customButton
                                          );
                                        } else {
                                          const source = { uri: response.uri };
                                          ImageResizer.createResizedImage(
                                            source.uri,
                                            500,
                                            500,
                                            "JPEG",
                                            50
                                          )
                                            .then((response) => {
                                              let data = new FormData();
                                              if (response) {
                                                data.append("avatar", {
                                                  name: "avatar",
                                                  type: "image/jpeg",
                                                  uri:
                                                    Platform.OS === "android"
                                                      ? response.uri
                                                      : response.uri.replace(
                                                          "file://",
                                                          ""
                                                        ),
                                                });

                                                fetch(
                                                  apiUrl +
                                                    "user/avatar/" +
                                                    this.props.userId,
                                                  {
                                                    method: "POST",
                                                    headers: {
                                                      authorization:
                                                        "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                                    },
                                                    body: data,
                                                  }
                                                )
                                                  .then((res) => {
                                                    let data11 = res.json();
                                                    let status11 = res.status;
                                                    //console.log(res);
                                                    return Promise.all([
                                                      data11,
                                                      status11,
                                                    ]);
                                                  })
                                                  .then(
                                                    ([data11, status11]) => {
                                                      if (status11 == 200) {
                                                        Toast.show(
                                                          "Profile Pic Updated",
                                                          Toast.LONG
                                                        );
                                                        value.updateProfilePic(
                                                          response.uri
                                                        );
                                                        this.setState({
                                                          avatarSource:
                                                            response.uri,
                                                          imagePicked: true,
                                                        });
                                                      }
                                                    }
                                                  )
                                                  .catch((error) => {
                                                    console.log(error);
                                                  });
                                              }
                                            })
                                            .catch((err) => {
                                              console.log(err);
                                            });
                                        }
                                      }
                                    );
                                  } else if (
                                    result["android.permission.CAMERA"] ||
                                    result[
                                      "android.permission.READ_EXTERNAL_STORAGE"
                                    ] ||
                                    result[
                                      "android.permission.WRITE_EXTERNAL_STORAGE"
                                    ] === "denied"
                                  ) {
                                    Toast.show(
                                      "Permissions denied",
                                      Toast.LONG
                                    );
                                  } else if (
                                    result["android.permission.CAMERA"] ||
                                    result[
                                      "android.permission.READ_EXTERNAL_STORAGE"
                                    ] ||
                                    result[
                                      "android.permission.WRITE_EXTERNAL_STORAGE"
                                    ] === "never_ask_again"
                                  ) {
                                    Toast.show(
                                      "Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue",
                                      Toast.LONG
                                    );
                                  }
                                });
                              } //...........................ios
                              else {
                                ImagePicker.launchImageLibrary(
                                  options,
                                  (response) => {
                                    // console.log(response);
                                    // console.log("Response = ", response);
                                    if (response.didCancel) {
                                      console.log(
                                        "User cancelled image picker"
                                      );
                                    } else if (response.error) {
                                      console.log(
                                        "ImagePicker Error: ",
                                        response.error
                                      );
                                    } else if (response.customButton) {
                                      console.log(
                                        "User tapped custom button: ",
                                        response.customButton
                                      );
                                    } else {
                                      const source = { uri: response.uri };
                                      ImageResizer.createResizedImage(
                                        source.uri,
                                        500,
                                        500,
                                        "JPEG",
                                        50
                                      )
                                        .then((response) => {
                                          let data = new FormData();
                                          if (response) {
                                            data.append("avatar", {
                                              name: "avatar",
                                              type: "image/jpeg",
                                              uri:
                                                Platform.OS === "android"
                                                  ? response.uri
                                                  : response.uri.replace(
                                                      "file://",
                                                      ""
                                                    ),
                                            });

                                            fetch(
                                              apiUrl +
                                                "user/avatar/" +
                                                this.props.userId,
                                              {
                                                method: "POST",
                                                headers: {
                                                  authorization:
                                                    "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
                                                },
                                                body: data,
                                              }
                                            )
                                              .then((res) => {
                                                let data11 = res.json();
                                                let status11 = res.status;
                                                //console.log(res);
                                                return Promise.all([
                                                  data11,
                                                  status11,
                                                ]);
                                              })
                                              .then(([data11, status11]) => {
                                                if (status11 == 200) {
                                                  Toast.show(
                                                    "Profile Pic Updated",
                                                    Toast.LONG
                                                  );
                                                  value.updateProfilePic(
                                                    response.uri
                                                  );
                                                  this.setState({
                                                    avatarSource: response.uri,
                                                    imagePicked: true,
                                                  });
                                                }
                                              })
                                              .catch((error) => {
                                                console.log(error);
                                              });
                                          }
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        });
                                    }
                                  }
                                );
                              }
                            }}
                          >
                            <Image
                              style={{
                                width: 12,
                                height: 12,
                                resizeMode: "contain",
                              }}
                              source={require("../src/photo_camera.png")}
                            />
                          </TouchableOpacity>
                        ) : null} */}
                      </View>

                      {this.state.edit ? (
                        <View style={{ paddingTop: widthPercentageToDP(2.5) }}>
                          <Text
                            style={{
                              color: "#fff",
                              fontFamily: "Montserrat-SemiBold",
                              fontSize: widthPercentageToDP(3.3),
                            }}
                          >
                            Edit Profile
                          </Text>
                        </View>
                      ) : (
                        <View //...............................nameInfo
                          style={{
                            paddingTop: widthPercentageToDP(2.5),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Montserrat-SemiBold",
                              fontSize: widthPercentageToDP("3.3%"),
                              textTransform: "capitalize",
                            }}
                          >
                            {value.name}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Montserrat-Regular",
                              fontSize: widthPercentageToDP("3.3%"),
                            }}
                          >
                            {value.phone}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Montserrat-Regular",
                              fontSize: widthPercentageToDP("3.3%"),
                            }}
                          >
                            {value.email}
                          </Text>
                        </View>
                      )}
                    </View>
                  </ImageBackground>
                </LinearGradient>
                <ScrollView
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {this.state.edit ? (
                    <View
                      style={{
                        width: "100%",
                        height: heightPercentageToDP("100%"),
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      {/* <View
                        style={{
                          width: "100%",
                          height: widthPercentageToDP(2),
                        }}
                      /> */}
                      <View //...................................name
                        style={styles.v1}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("10%") },
                          ]}
                        >
                          {/* {Platform.OS === "android" ? ( */}
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />
                          {/* ) : null} */}
                          {/* {Platform.OS === "android" ? ( */}
                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />
                          {/* ) : null} */}
                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                                // Platform.OS === "ios"
                                //   ? "#f9f9f9"
                                //   : "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Name
                            </Text>
                          </View>
                        </View>
                        <TextInput
                          style={{ width: "100%", height: "100%" }}
                          value={this.state.name}
                          onChangeText={(txt) => this.setState({ name: txt })}
                        />
                      </View>
                      <View //...................................Email Btn
                        style={[styles.v1, { justifyContent: "space-between" }]}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("10%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />
                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />
                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Email
                            </Text>
                          </View>
                        </View>
                        <Text style={{ paddingLeft: widthPercentageToDP(1) }}>
                          {this.state.email}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.onEmailPhoneUpdate("email")}
                        >
                          <Text style={{ color: primaryColor }}>Update</Text>
                        </TouchableOpacity>
                      </View>
                      <View //...................................Phone Number Btn
                        style={[styles.v1, { justifyContent: "space-between" }]}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("12%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Phone
                            </Text>
                          </View>
                        </View>
                        <Text style={{ paddingLeft: widthPercentageToDP(1) }}>
                          {this.state.phone}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.onEmailPhoneUpdate("phone")}
                        >
                          <Text style={{ color: primaryColor }}>Update</Text>
                        </TouchableOpacity>
                      </View>
                      {this.state.country == "India" ? (
                        <View //...................................panNumber
                          style={[
                            styles.v1,
                            {
                              borderColor: this.state.panNumberValidation
                                ? "grey"
                                : "red",
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.editStyle,
                              { width: widthPercentageToDP("21%") },
                            ]}
                          >
                            <View
                              style={{
                                backgroundColor: "#f9f9f9",
                                height: "48%",
                                width: "100%",
                              }}
                            />

                            <View
                              style={{
                                backgroundColor: "#fff",
                                height: "52%",
                                width: "100%",
                              }}
                            />

                            <View
                              style={[
                                styles.floatingTxt,
                                {
                                  backgroundColor: "rgba(0,0,0,0)",
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  fontSize: widthPercentageToDP("3.2%"),
                                }}
                              >
                                Pan Number
                              </Text>
                            </View>
                          </View>
                          {this.state.panNumberSubmitted ? (
                            <View
                              style={{
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                              }}
                            >
                              <Text>{this.state.panNumber}</Text>
                            </View>
                          ) : (
                            <TextInput
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              value={this.state.panNumber}
                              onChangeText={(txt) =>
                                this.setState({ panNumber: txt })
                              }
                              autoCapitalize="characters"
                              onEndEditing={(e) => {
                                if (e.nativeEvent.text.length != 10) {
                                  Toast.showWithGravity(
                                    "Must be of 10 character",
                                    Toast.LONG,
                                    Toast.BOTTOM
                                  );
                                  this.setState({
                                    panNumberValidation: false,
                                  });
                                } else {
                                  //alert(panRegex.test(e.nativeEvent.text));
                                  if (panRegex.test(e.nativeEvent.text)) {
                                    this.setState({
                                      panNumberValidation: true,
                                    });
                                  } else {
                                    Toast.showWithGravity(
                                      "Enter a valid Pan Number",
                                      Toast.LONG,
                                      Toast.BOTTOM
                                    );
                                    this.setState({
                                      panNumberValidation: false,
                                    });
                                  }

                                  //this.txtinput5.focus();
                                }
                              }}
                            />
                          )}
                        </View>
                      ) : null}
                      <View //...................................address
                        style={styles.v1}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("15%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Address
                            </Text>
                          </View>
                        </View>
                        <TextInput
                          style={{ width: "100%", height: "100%" }}
                          value={this.state.address}
                          autoCapitalize="words"
                          onChangeText={(txt) =>
                            this.setState({ address: txt })
                          }
                        />
                      </View>
                      {/* <View //...................................Landmark
                        style={styles.v1}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("15%") },
                          ]}
                        >
                          {Platform.OS === "android" ? (
                            <View
                              style={{
                                backgroundColor: "#f9f9f9",
                                height: "48%",
                                width: "100%",
                              }}
                            />
                          ) : null}
                          {Platform.OS === "android" ? (
                            <View
                              style={{
                                backgroundColor: "#fff",
                                height: "52%",
                                width: "100%",
                              }}
                            />
                          ) : null}
                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor:
                                  Platform.OS === "ios"
                                    ? "#fff"
                                    : "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Landmark
                            </Text>
                          </View>
                        </View>
                        <TextInput
                          style={{ width: "100%", height: "100%" }}
                          // value={this.state.landmark}
                          autoCapitalize="words"
                          onChangeText={(txt) =>
                            // this.setState({ landmark: txt })
                          }
                        />
                      </View> */}
                      <View //...................................State
                        style={styles.v1}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("9%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              State
                            </Text>
                          </View>
                        </View>
                        {Platform.OS === "android" ? (
                          <Picker
                            selectedValue={this.state.userState}
                            style={{
                              width: "100%",
                              height: "100%",
                              paddingBottom: 6,
                              color: "#454545",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                              if (itemValue != "Select your State") {
                                this.setState({
                                  userState: itemValue,
                                });
                                for (
                                  i = 0;
                                  i < this.state.stateArr.length;
                                  i++
                                ) {
                                  if (
                                    this.state.stateArr[i]["stateName"] ==
                                    itemValue
                                  ) {
                                    this.getCities(
                                      this.state.stateArr[i]["stateID"],
                                      true
                                    );
                                    break;
                                  }
                                }
                              }
                            }}
                          >
                            {this.state.stateArr.map((item, index) => (
                              <Picker.Item
                                key={index.toString()}
                                label={item["stateName"]}
                                value={item[["stateName"]]}
                              />
                            ))}
                          </Picker>
                        ) : (
                          <IOSPicker
                            mode="modal"
                            selectedValue={this.state.userState}
                            style={{
                              width: "100%",
                              height: "70%",
                              paddingBottom: 6,
                              color: "#454545",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                              if (itemValue != "Select your State") {
                                this.setState({
                                  userState: itemValue,
                                });
                                for (
                                  i = 0;
                                  i < this.state.stateArr.length;
                                  i++
                                ) {
                                  if (
                                    this.state.stateArr[i]["stateName"] ==
                                    itemValue
                                  ) {
                                    this.getCities(
                                      this.state.stateArr[i]["stateID"],
                                      true
                                    );
                                    break;
                                  }
                                }
                              }
                            }}
                          >
                            {this.state.stateArr.map((item, index) => (
                              <Picker.Item
                                key={index.toString()}
                                label={item["stateName"]}
                                value={item[["stateName"]]}
                              />
                            ))}
                          </IOSPicker>
                        )}
                      </View>
                      <View //...................................city
                        style={styles.v1}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("7%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              City
                            </Text>
                          </View>
                        </View>
                        {Platform.OS === "android" ? (
                          <Picker
                            selectedValue={this.state.city}
                            style={{
                              width: "100%",
                              height: "70%",
                              paddingBottom: 6,
                              color: "#454545",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                              if (itemValue != "Select your City") {
                                this.setState({
                                  city: itemValue,
                                });
                              }
                            }}
                          >
                            {this.state.cityArr.map((item, index) => (
                              <Picker.Item
                                key={index.toString()}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        ) : (
                          <IOSPicker
                            mode="modal"
                            selectedValue={this.state.city}
                            style={{
                              width: "100%",
                              height: "70%",
                              paddingBottom: 6,
                              color: "#454545",
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                              if (itemValue != "Select your City") {
                                this.setState({
                                  city: itemValue,
                                });
                              }
                            }}
                          >
                            {this.state.cityArr.map((item, index) => (
                              <Picker.Item
                                key={index.toString()}
                                label={item}
                                value={item}
                              />
                            ))}
                          </IOSPicker>
                        )}
                      </View>
                      <View //...................................pinCode
                        style={[
                          styles.v1,
                          {
                            borderColor: this.state.pinCodeCheck
                              ? "grey"
                              : "red",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.editStyle,
                            { width: widthPercentageToDP("23%") },
                          ]}
                        >
                          <View
                            style={{
                              backgroundColor: "#f9f9f9",
                              height: "48%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: "#fff",
                              height: "52%",
                              width: "100%",
                            }}
                          />

                          <View
                            style={[
                              styles.floatingTxt,
                              {
                                backgroundColor: "rgba(0,0,0,0)",
                              },
                            ]}
                          >
                            <Text
                              style={{ fontSize: widthPercentageToDP("3.2%") }}
                            >
                              Pin/City Code
                            </Text>
                          </View>
                        </View>
                        <TextInput
                          style={{ width: "100%", height: "100%" }}
                          value={this.state.pinCode}
                          onChangeText={(txt) =>
                            this.setState({ pinCode: txt })
                          }
                          autoCapitalize="characters"
                          onEndEditing={(e) => {
                            if (e.nativeEvent.text.length > 9) {
                              Toast.show(
                                "Max Pin/City Code Length is 9",
                                Toast.LONG
                              );
                              this.setState({ pinCodeCheck: false });
                            } else {
                              this.setState({ pinCodeCheck: true });
                            }
                          }}
                        />
                      </View>
                      <View //..................................touchablebtn
                        style={{
                          width: "100%",
                          aspectRatio: 5 / 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let returned = value.putProfileInfo({
                              id: this.props.userId,
                              legalName: this.state.name,
                              state: this.state.userState,
                              city: this.state.city,
                              pinCode: this.state.pinCode,
                              avatar: this.state.avatarSource,
                              panNumber: this.state.panNumber,
                              address: this.state.address,
                              // landmark: this.state.landmark,
                            });

                            if (returned) {
                              this.setState({
                                edit: false,
                                panNumberSubmitted: this.state.panNumber
                                  ? true
                                  : false,
                              });
                            }
                          }}
                          style={{
                            width: "90%",
                            height: "70%",
                            opacity: this.state.edit ? 1 : 0,
                            backgroundColor:
                              this.state.name &&
                              this.state.city &&
                              this.state.city != "Select your City" &&
                              this.state.userState != "Select your State" &&
                              this.state.userState &&
                              this.state.pinCode &&
                              this.state.address &&
                              // this.state.landmark &&
                              this.state.panNumberValidation &&
                              this.state.pinCodeCheck &&
                              (this.state.panNumber
                                ? this.state.panNumberValidation
                                : true) &&
                              this.state.pinCodeCheck
                                ? "#42aec2"
                                : "#dfdfdf",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            elevation: 15,
                          }}
                          disabled={
                            !(
                              this.state.name &&
                              this.state.city &&
                              this.state.city != "Select your City" &&
                              this.state.userState != "Select your State" &&
                              this.state.userState &&
                              this.state.address &&
                              // this.state.landmark &&
                              this.state.pinCode &&
                              (this.state.panNumber
                                ? this.state.panNumberValidation
                                : true) &&
                              this.state.pinCodeCheck
                            )
                          }
                        >
                          <Text
                            style={{
                              color:
                                this.state.name &&
                                this.state.city &&
                                this.state.city != "Select your City" &&
                                this.state.userState != "Select your State" &&
                                this.state.userState &&
                                this.state.pinCode &&
                                this.state.address &&
                                // this.state.landmark &&
                                (this.state.panNumber
                                  ? this.state.panNumberValidation
                                  : true) &&
                                this.state.pinCodeCheck
                                  ? "#deffffff"
                                  : "#9f9f9f",
                              fontSize: 18,
                              fontFamily: "Montserrat-SemiBold",
                            }}
                          >
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  <View
                    style={{
                      width: "100%",
                      height: this.state.keyboardViewHeight,
                    }}
                  />
                  {this.state.edit ? null : (
                    <View //.....................................80g receipts/donor account
                      style={{
                        width: "100%",
                        aspectRatio: 5 / 2.5,
                        justifyContent: "flex-start",
                      }}
                    >
                      {this.props.country == "India" ? (
                        <TouchableOpacity //.................................80g receipt
                          style={{
                            width: "90%",
                            aspectRatio: 5.5 / 1,
                            borderRadius: 4,
                            elevation: 10,
                            flexDirection: "row",
                            alignSelf: "center",
                            backgroundColor: "white",
                            marginTop: 18,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.3,
                            shadowRadius: 1,
                          }}
                          onPress={() =>
                            Actions.push("receipt", {
                              userId: this.props.userId,
                              email: this.state.email,
                            })
                          }
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../src/receipt.png")}
                              style={{
                                width: 20,
                                height: 20,
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 4,
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                color: "#42aec2",
                                fontFamily: "Montserrat-SemiBold",
                                fontSize: widthPercentageToDP("3.6%"),
                              }}
                            >
                              80G Receipts
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Icon
                              name="chevron-right"
                              size={18}
                              color="#42aec2"
                            />
                          </View>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity //.................................donor account
                        style={{
                          width: "90%",
                          aspectRatio: 5.5 / 1,
                          borderRadius: 4,
                          elevation: 10,
                          flexDirection: "row",
                          alignSelf: "center",
                          backgroundColor: "white",
                          marginTop: 18,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.3,
                          shadowRadius: 1,
                        }}
                        onPress={() => Actions.push("donorAccount")}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../src/user_1.png")}
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 4,
                            justifyContent: "center",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              color: "#42aec2",
                              fontFamily: "Montserrat-SemiBold",
                              fontSize: widthPercentageToDP("3.6%"),
                            }}
                          >
                            Donation Details
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name="chevron-right"
                            size={18}
                            color="#42aec2"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              </View>
            </React.Fragment>
          );
        }}
      </ProfileControllerConsumer>
    );
  }
}
const styles = StyleSheet.create({
  v1: {
    width: "90%",
    aspectRatio: 6 / 1,
    borderWidth: 0.5,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  editStyle: {
    width: 50,
    height: heightPercentageToDP("3.3%"),
    justifyContent: "center",
    alignItems: "flex-start",
    position: "absolute",
    //backgroundColor: "#f9f9f9",
    top: -14,
    left: 18,
  },
  floatingTxt: {
    position: "absolute",
    right: 0,
    left: 2,
    top: Platform.OS === "ios" ? 5 : 3,
    justifyContent: "center",
    //alignItems: "center"
  },
});
