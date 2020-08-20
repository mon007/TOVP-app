import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import I18n from "react-native-i18n";
import {
  heightPercentageToDP,
  widthPercentageToDP
} from "react-native-responsive-screen";
import { Actions } from "react-native-router-flux";

const deviceWidth = Dimensions.get("window").width;
const FIXED_BAR_WIDTH = 220;
const BAR_SPACE = 15;

export default class HorizontalSwip extends Component {
  state = {
    title: this.props.data[0].title
  };
  numItems = this.props.data.length;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  //   advantagesInfoChange = offset => {
  //     if (offset == 0) {
  //       this.setState({
  //         title: this.props.data[0].title
  //       });
  //     } else if (offset > 0 && offset < 500) {
  //       this.setState({
  //         title: this.props.data[1].title
  //       });
  //     } else if (offset > 500 && offset < 900) {
  //       this.setState({
  //         title: this.props.data[2].title
  //       });
  //     } else if (offset > 900) {
  //       this.setState({
  //         title: this.props.data[3].title
  //       });
  //     }
  //   };

  render() {
    let onGoingView = [];
    let barArray = [];
    this.props.data.forEach((data, i) => {
      const thisView = (
        //change this for per page

        <LinearGradient
          key={`data${i}`}
          colors={data.color}
          style={{
            width: deviceWidth - 150,
            height: "97%",
            borderRadius: 5,
            justifyContent: "flex-end",
            alignItems: "flex-start",
            marginRight: 6,
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1
            }}
            onPress={() => {
              Actions.push(`horizontalSwip${i + 1}`);
            }}
          >
            <ImageBackground
              source={require("../src/tovp_bg_10.png")}
              style={{
                width: deviceWidth - 180,
                height: "100%",
                borderRadius: 5,
                alignSelf: "center",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
              imageStyle={{ borderRadius: 4, resizeMode: "cover" }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  paddingBottom: 16,
                  paddingLeft: 8
                }}
              >
                <Text
                  style={{
                    fontSize: widthPercentageToDP("3.3%"),
                    color: "white",
                    fontFamily: "Montserrat-Bold"
                  }}
                >
                  {I18n.t(data.title)}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </LinearGradient>
      );
      onGoingView.push(thisView);

      const scrollBarVal = this.animVal.interpolate({
        inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: "clamp"
      });

      // const thisBar = (
      //   <View
      //     key={`bar${i}`}
      //     style={[
      //       styles.track,
      //       {
      //         width: this.itemWidth,
      //         marginLeft: i === 0 ? 0 : BAR_SPACE
      //       }
      //     ]}
      //   >
      //     <Animated.View
      //       style={[
      //         styles.bar,
      //         {
      //           width: this.itemWidth,
      //           transform: [{ translateX: scrollBarVal }]
      //         }
      //       ]}
      //     />
      //   </View>
      // );
      // barArray.push(thisBar);
    });

    return (
      <View style={styles.container} flex={1}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          // pagingEnabled
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: this.animVal } } }
          ])}
          // onMomentumScrollEnd={e =>
          //   this.advantagesInfoChange(e.nativeEvent.contentOffset.x)
          // }
        >
          {onGoingView}
        </ScrollView>
        {/* <View style={styles.barContainer}>{barArray}</View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  barContainer: {
    position: "absolute",
    zIndex: 2,
    bottom: 8,
    flexDirection: "row"
  },
  track: {
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    height: 10,
    borderRadius: 18
  },
  bar: {
    backgroundColor: "#4095ff",
    height: 10,
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 18
  }
});
