import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  Text
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";

const deviceWidth = Dimensions.get("window").width;
const FIXED_BAR_WIDTH = 220;
const BAR_SPACE = 15;

export default class CampaignSlide extends Component {
  state = {
    animate: new Animated.Value(0)
  };
  componentDidMount() {
    Animated.spring(this.state.animate, {
      toValue: 1
    }).start();
  }
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
      // var percent =
      //   ((100 / data.totalInstallment) * data.paidInstallments).toString() +
      //   "%";
      // const animatedWidth = this.state.animate.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: ["0%", percent]
      // });
      const thisView = (
        //change this for per page
        <TouchableOpacity
          key={`data${i}`}
          style={{
            width: deviceWidth - 60,
            height: "90%",
            borderRadius: 10,
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            justifyContent: "space-between",
            alignItems: "center",
            margin: 8,
            backgroundColor: "#fff",
            elevation: 5,
            flexDirection: "row"
          }}
          onPress={() =>
            Actions.push("singleCampaign", {
              item: this.props.item[i],
              userId: this.props.userId,
              email: this.props.email,
              country: this.props.country,
              _id: this.props.item[i]._id
            })
          }
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={{ uri: data }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                resizeMode: "cover"
              }}
            />
          </View>

          {/* <View
            style={{
              flex: 2,
              height: "100%",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              paddingLeft: 18
            }}
          >
            <Text
              style={{
                color: "#454545",
                fontSize: 28,
                fontFamily: "Montserrat-SemiBold"
              }}
            >
              {data.price}
            </Text>
            <Text
              style={{
                color: "#454545",
                fontSize: 13,
                fontFamily: "Montserrat-Regular"
              }}
            >
              Raised so far
            </Text>
            <Text
              style={{
                color: "#454545",
                fontSize: 16,
                fontFamily: "Montserrat-SemiBold"
              }}
            >
              {data.emi}
            </Text>
            <View
              style={{
                width: "70%",
                height: 2,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: 10,
                marginBottom: 4,
                alignItems: "flex-start"
              }}
            >
              <Animated.View
                style={{
                  width: animatedWidth,
                  height: "100%",
                  backgroundColor: "#42aec2",
                  borderRadius: 10,
                  marginBottom: 4
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    position: "absolute",
                    right: 0,
                    bottom: -7,
                    elevation: 10,
                    backgroundColor: "#42aec2",
                    borderRadius: 10,
                    marginBottom: 4
                  }}
                />
              </Animated.View>
            </View>
          </View> */}
        </TouchableOpacity>
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
