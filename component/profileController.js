import React from "react";
import { Platform } from "react-native";
import { apiUrl } from "./config";
//import RNFetchBlob from "rn-fetch-blob";
//import base64 from "react-native-base64";

const ReactContext = React.createContext();

class ProfileControllerProvider extends React.Component {
  state = {
    name: "",
    email: "",
    phone: "",
    city: "",
    userState: "",
    pinCode: "",
    profilePic: "",
    address: "",
    data: [],
    profileUpdated: false,
  };

  componentDidMount() {
    this.getVisionCarouselImages();
  }

  //Get Vision Top Horizontal Images
  getVisionCarouselImages = () => {
    fetch(`${apiUrl}user/homepagecarousel`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ data: resJson.images }); //resJson.images
        console.log("visionImages", resJson);
      })
      .catch((e) => {
        console.log(e);
        //this.setState({ data: [] });
      });
  };

  getProfileInfo = (userId) => {
    fetch(apiUrl + "user/profile/" + userId)
      .then((res) => res.json())
      .then((resJson) => {
        //console.log("uyuhihjh", resJson);
        this.setState({
          name: resJson.legalName,
          email: resJson.email,
          phone: resJson.phone,
          city: resJson.city,
          userState: resJson.state,
          pinCode: resJson.pinCode,
          address: resJson.address,
          profilePic: resJson.avatar,
        });
      })
      .catch((e) => console.log(e));
  };

  updateProfilePic = (avatar) => {
    this.setState({
      profileUpdated: true,
      profilePic: avatar,
    });
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
        id: item.id,
        legalName: item.legalName,
        state: item.state,
        city: item.city,
        pinCode: item.pinCode,
        panNo: item.panNumber,
        address: item.address,
        panNumberSubmitted: item.panNumber ? true : false,
      }),
    })
      .then((res) => {
        let data1 = res.json();
        let status1 = res.status;
        return Promise.all([data1, status1]);
      })
      .then(([data1, status1]) => {
        //console.log("yo", data1, status1);
        if (status1 == 200) {
          this.setState({
            name: data1.legalName,
            userState: data1.state,
            city: data1.city,
            pinCode: data1.pinCode,
            profileUpdated: true,
          });
        }
      })
      .catch((e) => console.log(e));
    return true;
  };

  onLogOut = () => {
    this.setState({
      name: "",
      email: "",
      phone: "",
      city: "",
      userState: "",
      pinCode: "",
      profilePic: "",
      address: "",
    });
  };

  render() {
    return (
      <ReactContext.Provider
        value={{
          name: this.state.name,
          email: this.state.email,
          phone: this.state.phone,
          city: this.state.city,
          userState: this.state.userState,
          pinCode: this.state.pinCode,
          getProfileInfo: this.getProfileInfo,
          putProfileInfo: this.putProfileInfo,
          profileUpdated: this.state.profileUpdated,
          profilePic: this.state.profilePic,
          updateProfilePic: this.updateProfilePic,
          onLogOut: this.onLogOut,
          data: this.state.data,
        }}
      >
        {this.props.children}
      </ReactContext.Provider>
    );
  }
}
const ProfileControllerConsumer = ReactContext.Consumer;
export { ProfileControllerConsumer, ProfileControllerProvider };
