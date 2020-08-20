import React from "react";
import {
  YellowBox,
  Animated,
  Platform,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import Toast from "react-native-simple-toast";
import { ContextProvider, ContextConsumer } from "./component/contextApi";
import HomescreenRouter from "./component/homescreenRouter";
import LogRouter from "./component/logRouter";
import { Actions } from "react-native-router-flux";
import AsyncStorage from "@react-native-community/async-storage";
import SplashScreen from "./component/splashScreen";
import I18n from "./app/i18n/i18n.js";
import firebase from "react-native-firebase";
import { ProfileControllerProvider } from "./component/profileController";
import NetInfo from "@react-native-community/netinfo";
import { getAppstoreAppVersion } from "react-native-appstore-version-checker";
//import DeviceInfo from "react-native-device-info";
import {
  apiUrl,
  paypalApiUrl,
  razorpayKey,
  razorpayKey_secret,
  androidAppVersionName,
  iosAppVersionName,
} from "./component/config";
import Modal from "react-native-modal";
import { widthPercentageToDP } from "react-native-responsive-screen";

const axios = require("axios");

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
var unsubscribe1;
var insideApp = false;

/**
 * App.js is the top level component, it is controlling the login-logOut flow,
 * depending on what api or asyncStorage returns it either redirects to the homescreenRouter or logRouter.
 * There are two router, one handles logIn, signUp flow and the other everything else.---React-native-router-flux.
 *
 * Two contextApi is being used one(profileController.js) handles profile-update flow and the other everything else(contextApi.js).
 *
 */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    console.reportErrorsAsExceptions = false;
    this.navBarAnimate = new Animated.Value(1);
    this.buttonAnimate = new Animated.Value(0);
  }

  state = {
    loading: true,
    userId: null,
    appLanguage: "",
    email: null,
    country: null,
    referralCode: null,
    countryId: "",
    logR: false,
    updateModal: false,
    appVersion: null,
    storeName: null,
    releaseNote: [],
  };

  componentDidMount() {
    this.createNotificationListeners(); //notifivcation listener
    unsubscribe1 = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        if (!insideApp) {
          this.checkAppVersion();
          this.getId().then(() => {
            this.getLanguage();
          });
        }
      } else {
        Toast.show("Network error", Toast.LONG);
      }
    });
  }
  componentWillUnmount() {
    insideApp = false;
    unsubscribe1();
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        console.log("onNotification:", notification);
        const channelID = new firebase.notifications.Android.Channel(
          "Default",
          "Default",
          firebase.notifications.Android.Importance.Max
        ).setDescription("A natural description of the channel");
        //.setSound("sampleaudio.wav");
        firebase.notifications().android.createChannel(channelID);

        // const localNotification = new firebase.notifications.Notification({
        //   data: notification._android._notification._data,
        //   sound: "default",
        //   show_in_foreground: true,
        //   title: notification.title,
        //   body: notification.body
        // });
        const localNotification = new firebase.notifications.Notification({
          sound: "default",
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId("Default") // e.g. the id you chose above
          //.android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
          .android.setColor("#000000") // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        if (Platform.OS == "android") {
          localNotification.android
            .setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId("Default");
        } else {
          localNotification.ios.setBadge(notification.ios.badge);
        }

        //displaying a message
        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch((err) => console.error(err));
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        console.log("onNotificationOpened:", notificationOpen);
        // const { title, body } = notificationOpen.notification;
        Actions.replace("notificationList");

        //console.log(title, body);
      });

    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("DataOnlyPayload:", JSON.stringify(message));
    });
  }

  checkAppVersion = () => {
    if (Platform.OS == "android") {
      getAppstoreAppVersion("com.tovp")
        .then((appVersion) => {
          if (Number(appVersion) > Number(androidAppVersionName)) {
            this.getReleaseNotes(appVersion, "playStore");
          }
        })
        .catch((err) => {
          console.log("error occurred", err);
        });
    } else {
      //....for iOS
      getAppstoreAppVersion("1480708701")
        .then((appVersion) => {
          if (Number(appVersion) > Number(iosAppVersionName)) {
            this.getReleaseNotes(appVersion, "AppStore");
          }
        })
        .catch((err) => {
          console.log("error occurred", err);
        });
    }
  };

  getReleaseNotes = (appVersion, storeName) => {
    fetch(`${apiUrl}release`)
      .then((res) => {
        let data = res.json();
        let status = res.status;
        return Promise.all([data, status]);
      })
      .then(([data, status]) => {
        let releaseNote = [];
        if (status == 200) {
          releaseNote = data.releaseNote;
        }
        this.setState({
          releaseNote,
          updateModal: true,
          appVersion,
          storeName,
        });
      })
      .catch((e) => console.log(e));
  };

  onUpdatePress = () => {
    if (this.state.storeName == "AppStore") {
      //this.setState({ updateModal: false });
      Linking.openURL("https://apps.apple.com/us/app/tovp/id1480708701");
    } else {
      //this.setState({ updateModal: false });
      Linking.openURL("https://play.google.com/store/apps/details?id=com.tovp");
    }
  };

  /**
   * getId() checks whether the userId is in asyncStorage or not
   */
  getId = async () => {
    try {
      AsyncStorage.getItem("userId1").then((userId) => {
        fetch(apiUrl + "user/check/" + userId)
          .then((res) => {
            const statusCode = res.status;
            const data = res.json();
            return Promise.all([statusCode, data]);
          })
          .then(([status, data]) => {
            if (status == 200) {
              this.setState({ userId });
            } else if (status == 404 || status == 502 || status == 500) {
              Alert.alert(
                "TOVP",
                "Server under maintenance for the next 24 hours. For any query kindly mail to info@tovp.org",
                [
                  {
                    text: "Close App",
                    onPress: () => BackHandler.exitApp(),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () =>
                      this.getId().then(() => {
                        this.getLanguage();
                      }),
                  },
                ],
                { cancelable: false }
              );
            } else {
              this.logOut();
            }
          });
      });

      let keys = ["email", "country", "referralCode", "countryId"];
      AsyncStorage.multiGet(keys, (err, stores) => {
        let obj = {};
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          let key = store[i][0];
          let value = store[i][1];
          obj[key] = value;
        });
        this.setState(obj);
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * logOut() is self explainatory
   */
  logOut = async () => {
    AsyncStorage.clear().then(() => this.setState({ logR: true }));
  };

  /**
   * getLanguage(), a asyncFunction extracts data-"appLanguage" from asyncStorage
   */
  getLanguage = async () => {
    try {
      AsyncStorage.getItem("appLanguage").then((appLanguage) => {
        if (appLanguage == "russian") {
          I18n.locale = "russia";
        } else if (appLanguage == "english") {
          I18n.locale = "en";
        }
        insideApp = true;
        this.setState({ appLanguage, loading: false });
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * paymentController() is the top level app-function which is hit after the paymentGatway(razorpay,paypal) returns success, it
   * posts the transaction details to the database
   */
  paymentController = async (item) => {
    let url = `${apiUrl}paypal`;
    let res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasTransactionFee: item.hasTransactionFee,
        transactionId: item.transactionId,
        paymentId: item.paymentId,
        offsetInHours: new Date().getTimezoneOffset() / 60,
        productId: item.productId,
        email: item.email,
        itemName: item.itemName,
        userId: item.userId,
        totalEmi: item.totalEmi,
        amount: item.amount,
        perMonthAmount: item.perMonthAmount,
        payInFull: item.payInFull,
        paymentMode: item.paymentMode,
        campaignFlag: item.campaignFlag,
        campaignId: item.campaignId,
        currencyType: item.currencyType,
        count: item.count,
      }),
    });
    let data = res.json();
    let status = res.status;
    if (status == 200 || data.message == "error sending sms") {
      return data;
    }
  };

  /**
   * flagPaymentController() is same as paymentController but for the flag-donation
   */
  flagPaymentController = async (item) => {
    console.log("flag326", item);
    let url = `${apiUrl}flag/update`;
    let res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: "1M9CGo3dXJdtTJGJOtxZijv0UQ8YICjiAQun73FZCxajWtGy",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hasTransactionFee: item.hasTransactionFee,
        transactionId: item.transactionId,
        paymentId: item.paymentId,
        offsetInHours: new Date().getTimezoneOffset() / 60,
        productId: item.productId,
        flagName: item.flagName,
        userId: item.userId,
        date: item.date,
        time: item.time,
        paymentMode: item.paymentMode,
        currencyType: item.currencyType,
        amount: item.amount,
      }),
    });
    let data = res.json();
    console.log("gg", data);
    let status = res.status;
    if (status == 200 || data.message == "error sending sms") {
      return data;
    }
  };

  /**
   * RecurringPaymentController same as paymentController  but for recurringPayments
   */
  recurringPaymentController = async (url) => {
    console.log(url);
    let res = await fetch(url);
    let data = res.json();
    let status = res.status;
    if (status == 200 || data.message == "error sending sms") {
      return data;
    }
  };

  /**
   * autoCaptureRazorpay() hits an api with paymentId to capture the razorpay payment
   */
  autoCaptureRazorPay = (payment_id, amount) => {
    // console.log("its been called", payment_id, amount);
    let url = `https://api.razorpay.com/v1/payments/${payment_id}/capture`;
    axios({
      method: "post",
      url: url,
      headers: { "Content-Type": "application/json" },
      auth: {
        username: razorpayKey,
        password: razorpayKey_secret,
      },
      data: JSON.stringify({
        amount: Number(amount),
      }),
    })
      .then((resJson) => console.log("toooo", resJson))
      .catch((e) => {
        console.log(e);
        console.log(e.response);
      });
  };

  render() {
    if (this.state.loading) {
      return <SplashScreen />;
    } else {
      return (
        <React.Fragment>
          <Modal
            transparent={true}
            visible={this.state.updateModal}
            onRequestClose={() => {
              console.log("Modal has been closed.");
            }}
          >
            {this.state.updateModal && (
              <View
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    width: "90%",
                    height: "50%",
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 10,
                      paddingBottom: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Bold",
                        color: "#000",
                        fontSize: widthPercentageToDP("4%"),
                      }}
                    >
                      A new version of TOVP is available!
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: "flex-start",
                      marginRight: 10,
                      paddingTop: widthPercentageToDP(3),
                      paddingLeft: widthPercentageToDP(3.5),
                    }}
                  >
                    {/* <Text
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      color: "#454545",
                      fontSize: widthPercentageToDP("3.3%"),
                    }}
                  >
                    A new TOVP app version - {this.state.appVersion} is
                    available on {this.state.storeName}. Kindly update the app.
                  </Text> */}
                    <Text
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        color: "#454545",
                        fontSize: widthPercentageToDP("3.8%"),
                      }}
                    >
                      New Version {this.state.appVersion} :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#000",
                        paddingTop: widthPercentageToDP(2),
                        paddingLeft: widthPercentageToDP(2),
                        fontSize: widthPercentageToDP("3.5%"),
                      }}
                    >
                      Release Notes:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        color: "#000",
                        fontSize: widthPercentageToDP("3.5%"),
                        paddingLeft: widthPercentageToDP(2),
                      }}
                    >
                      New and enhanced features
                    </Text>
                    {this.state.releaseNote.map((item, index) => (
                      <Text
                        key={index.toString()}
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#000",
                          paddingLeft: widthPercentageToDP(2),
                          fontSize: widthPercentageToDP("3.5%"),
                        }}
                      >
                        -{item}
                      </Text>
                    ))}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: widthPercentageToDP(15),
                      justifyContent: "flex-end",
                      alignItems: "center",
                      borderTopWidth: 0.5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#42aec2",
                        width: widthPercentageToDP("26%"),
                        height: widthPercentageToDP("10%"),
                        elevation: 10,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 1,
                        borderRadius: 5,
                        marginBottom: 10,
                        marginRight: 10,
                      }}
                      onPress={this.onUpdatePress}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: widthPercentageToDP("3.2%"),
                        }}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Modal>
          <ProfileControllerProvider>
            <ContextProvider>
              <ContextConsumer>
                {(value) => {
                  if (this.state.userId && !value.loggedOut) {
                    return (
                      <HomescreenRouter
                        userId={this.state.userId}
                        email={this.state.email}
                        country={this.state.country}
                        referralCode={this.state.referralCode}
                        appLanguage={this.state.appLanguage}
                        countryId={this.state.countryId}
                        logOut={this.logOut}
                        paymentController={this.paymentController}
                        flagPaymentController={this.flagPaymentController}
                        recurringPaymentController={
                          this.recurringPaymentController
                        }
                        autoCaptureRazorPay={this.autoCaptureRazorPay}
                        //unread={value.unread}
                      />
                    );
                  } else if (value.logged) {
                    //value.getLocation();
                    return (
                      <HomescreenRouter
                        userId={value.userId}
                        email={value.email}
                        referralCode={value.referralCode}
                        country={value.country}
                        appLanguage={value.appLanguage}
                        countryId={value.countryId}
                        logOut={this.logOut}
                        paymentController={this.paymentController}
                        flagPaymentController={this.flagPaymentController}
                        recurringPaymentController={
                          this.recurringPaymentController
                        }
                        autoCaptureRazorPay={this.autoCaptureRazorPay}
                        //unread={value.unread}
                      />
                    );
                  } else if (this.state.logR) {
                    return <LogRouter />;
                  } else {
                    return <SplashScreen />;
                  }
                }}
              </ContextConsumer>
            </ContextProvider>
          </ProfileControllerProvider>
        </React.Fragment>
      );
    }
  }
}
