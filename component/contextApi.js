import React from "react";
import {
  PermissionsAndroid,
  BackHandler,
  DeviceEventEmitter,
} from "react-native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import { Actions } from "react-native-router-flux";
import { sha256 } from "react-native-sha256";
import I18n from "../app/i18n/i18n.js";
import { apiUrl } from "./config";
import firebase from "react-native-firebase";
import { notificationUrl, notificationUrlSetToken } from "./config";
//import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

var name = "";
var appLanguage;

// const url =
//   "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBX40Ua9rJHUuSWjQl3icsTdj4AHWW5w2M&latlng=11.2742848,75.8013801";
const ReactContext = React.createContext();
class ContextProvider extends React.Component {
  state = {
    logged: false,
    language: "",
    userId: "",
    loadingSignUp: false,
    location: null,
    country: null,
    name: "",
    email: "",
    phone: "",
    referralCode: "",
    userState: "",
    city: "",
    pincode: "",
    loggedOut: false,
    countryId: "",
    appLanguage: "english",
    notificationArr: [],
    unread: false,
    fetchingNotification: false,
    notificationRefreshing: false,
  };
  componentDidMount() {
    this.getProfileInfo();
    this.checkPermission();
  }
  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  getNotification = async () => {
    AsyncStorage.getItem("userId1").then((userId) => {
      let user_id = userId || this.state.userId;
      let url = `${notificationUrl}?id=${user_id}`;
      fetch(url)
        .then((res) => res.json())
        .then((resJson) => {
          let notificationArr = [].concat(this.state.notificationArr);
          notificationArr = resJson;
          // for (let i = 0; i < notificationArr.length; i++) {
          //   if (notificationArr[i].active) {
          //     this.setState({ unread: true, notificationArr });
          //     break;
          //   }
          // }
          console.log("notification", resJson);
          this.setState({
            notificationArr,
            fetchingNotification: true,
            notificationRefreshing: false,
          });
        })
        .catch((e) => {
          console.log(e);
          this.setState({ fetchingNotification: true });
        });
    });
  };

  onRefreshNotification = () => {
    this.setState({ notificationRefreshing: true });
    this.getNotification();
  };

  //change notification read status
  putNotification = async (notificationID) => {
    let userId = await AsyncStorage.getItem("userId1");
    let user_id = userId || this.state.userId;
    console.log(notificationID, user_id);
    let url = `${notificationUrl}/${user_id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: notificationID,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("a", resJson);
        let notificationArr = [].concat(this.state.notificationArr);
        notificationArr = resJson;
        this.setState({ notificationArr });
      })
      .catch((e) => console.log(e));
  };

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }
  //...............get the fcm token
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    let userId = await AsyncStorage.getItem("userId1");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token //Post token
        console.log("fcmToken:", fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }

    let user_id = userId || this.state.userId;
    console.log(user_id, fcmToken);
    fetch(notificationUrlSetToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user_id,
        registrationToken: fcmToken,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => console.log("nn", resJson))
      .catch((e) => console.log(e));
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }
  verifyEmail = (
    email,
    phone,
    password,
    legalName,
    initiatedName,
    address,
    country,
    continent,
    panNo,
    referralCode,
    countryId
  ) => {
    sha256(password).then((hash) => {
      fetch(`${apiUrl}user/register`, {
        method: "POST",
        headers: {
          authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone,
          password: hash,
          legalName,
          initiatedName,
          address,
          country,
          continent,
          panNo,
          referralCode,
          countryId,
        }),
      })
        .then((response) => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        })
        .then(([status, data]) => {
          if (status == 400 || status == 403) {
            Toast.show(data.message, Toast.LONG);
          } else if (status == 404) {
            Toast.show(data.message, Toast.LONG);
          } else if (status == 500) {
            Toast.show(data.message, Toast.LONG);
          } else if (status == 200) {
            //console.log(data);
            this.setState({
              userId: data.id,
              email: data.email,
              referralCode: data.referralCode,
              country: data.country,
              logged: true,
              countryId,
            });
            this.checkPermission();
          }
        })
        .catch((error) => {
          Toast.show(error, Toast.LONG);
        });
    });
  };
  chooseLanguage = (language) => {
    appLanguage = language;
    if (language == "russian") {
      I18n.locale = "russia";
      Actions.replace("chooseLog");
    } else if (language == "english") {
      I18n.locale = "en";
      Actions.replace("chooseLog");
    }
  };
  toggleLanguage = async (language) => {
    appLanguage = language;
    await AsyncStorage.setItem("appLanguage", appLanguage);
    if (language == "russian") {
      I18n.locale = "russia";
      //Actions.replace("chooseLog");
    } else if (language == "english") {
      I18n.locale = "en";
      //Actions.replace("chooseLog");
    }
    this.setState({ appLanguage });
  };

  logOut = async () => {
    //console.log("vvv");
    AsyncStorage.clear().then(() =>
      // AsyncStorage.removeItem("userId1").then(() =>
      this.setState({ logged: false, loggedOut: true })
    );
  };
  changeLoggedStatus = (data) => {
    //console.log(data);
    this.setState({
      userId: data.id,
      email: data.email,
      country: data.country,
      referralCode: data.referralCode,
      logged: true,
    });
    this.checkPermission();
  };
  getProfileInfo = () => {
    fetch(apiUrl + "user/profile/" + this.props.userId)
      .then((res) => res.json())
      .then((resJson) => {
        name = resJson.legalName;
        // this.setState({
        //   name: resJson.legalName,
        //   email: resJson.email,
        //   phone: resJson.phone,
        //   city: resJson.city,
        //   userState: resJson.state,
        //   pinCode: resJson.pinCode
        // });
      })
      .catch((e) => console.log(e));
  };
  putProfileInfo = (item) => {
    fetch(`${apiUrl}user/profile/`, {
      method: "PUT",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.userId,
        legalName: item.name,
        state: item.state,
        city: item.city,
        pinCode: item.pinCode,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        Toast.show("Updated", Toast.LONG);
        this.setState({
          name: resJson.legalName,
          edit: !this.state.edit,
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    return (
      <ReactContext.Provider
        value={{
          logged: this.state.logged,
          loggedOut: this.state.loggedOut,
          changeLoggedStatus: this.changeLoggedStatus,
          logOut: this.logOut,
          verifyEmail: this.verifyEmail,
          userId: this.state.userId,
          name: name,
          phone: this.state.phone,
          referralCode: this.state.referralCode,
          email: this.state.email,
          country: this.state.country,
          chooseLanguage: this.chooseLanguage,
          appLanguage: appLanguage,
          phone: this.state.phone,
          city: this.state.city,
          userState: this.state.userState,
          pinCode: this.state.pincode,
          getProfileInfo: this.getProfileInfo,
          putProfileInfo: this.putProfileInfo,
          countryId: this.state.countryId,
          toggle: this.toggleLanguage,
          putNotification: this.putNotification,
          getNotification: this.getNotification,
          onRefreshNotification: this.onRefreshNotification,
          notificationRefreshing: this.state.notificationRefreshing,
          notificationArr: this.state.notificationArr,
          fetchingNotification: this.state.fetchingNotification,
          //unread: this.state.unread
          //getLocation: this.getLocation
        }}
      >
        {this.props.children}
      </ReactContext.Provider>
    );
  }
}
const ContextConsumer = ReactContext.Consumer;
export { ContextProvider, ContextConsumer };
