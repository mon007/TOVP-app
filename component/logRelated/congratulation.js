import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ContextConsumer } from "../contextApi";

const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const screenWidth = Dimensions.get("window").width;
export default class Congratulation extends React.Component {
  constructor(props) {
    super(props);
    this.animate = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.spring(this.animate, {
      toValue: 1,
      speed: 0.5
    }).start();
  }
  render() {
    const animatedBottom = this.animate.interpolate({
      inputRange: [0, 1],
      outputRange: [-60, 60]
    });
    const animatedTxt = this.animate.interpolate({
      inputRange: [0, 1],
      outputRange: [-screenWidth, 0]
    });

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fc3255" />
        <View
          style={{
            flex: 2,
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Image
            source={require("../../src/FINAL.gif")}
            style={{ width: "90%", height: "90%" }}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Animated.View
            style={{
              width: "100%",
              height: 40,
              position: "absolute",
              right: animatedTxt,
              top: 60,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 20
              }}
            >
              Congratulations!
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              width: "100%",
              height: 30,
              position: "absolute",
              left: animatedTxt,
              top: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}>
              You have successfully logged in.
            </Text>
          </Animated.View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ContextConsumer>
            {value => (
              <AnimatedBtn
                onPress={value.logIn}
                style={[
                  styles.btnV,
                  { position: "absolute", right: "5%", bottom: animatedBottom }
                ]}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#fb6d64", "#fd4968"]}
                  style={styles.linearGradient}
                >
                  <Text style={styles.btnTxt}>Continue</Text>
                </LinearGradient>
              </AnimatedBtn>
            )}
          </ContextConsumer>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  btnV: {
    width: "90%",
    height: 50,
    borderRadius: 8
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  btnTxt: {
    fontSize: 18,
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold"
  }
});
