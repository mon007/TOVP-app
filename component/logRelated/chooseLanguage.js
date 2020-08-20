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
  Dimensions,
} from "react-native";
import { ContextConsumer } from "../contextApi";
import LinearGradient from "react-native-linear-gradient";
import { Actions } from "react-native-router-flux";

const screenWidth = Dimensions.get("window").width;
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);

export default class ChooseLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    //sha256("12345678").then(hash => console.log(hash));
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 1,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const animatedRight = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [-210, screenWidth / 2 - 105],
    });
    const animatedLeft = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [screenWidth, screenWidth / 2 - 105],
    });
    return (
      <ContextConsumer>
        {(value) => (
          <React.Fragment>
            <StatusBar hidden={true} />
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Image
                  source={require("../../src/buddha11.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              </View>
              <LinearGradient
                style={{ flex: 1, overflow: "visible" }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["rgb(0,150,165)", "rgb(34,110,173)"]}
              >
                <View style={{ width: "100%", aspectRatio: 5 / 1 }}>
                  <Image
                    source={require("../../src/logo12.png")}
                    style={{
                      width: 250,
                      height: 160,
                      position: "absolute",
                      right: (screenWidth - 250) / 2,
                      top: -65,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 5 / 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingBottom: 18,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 18,
                        color: "#fff",
                      }}
                    >
                      SELECT YOUR LANGUAGE
                    </Text>
                  </View>

                  <View //.............btn
                    style={{
                      flex: 1,
                      paddingTop: 20,
                    }}
                  >
                    <AnimatedBtn
                      onPress={() => {
                        value.chooseLanguage("english");
                      }}
                      style={[
                        styles.btnV,
                        {
                          position: "absolute",
                          //right: animatedWidth,
                          transform: [
                            {
                              translateX: animatedRight,
                            },
                          ],
                          top: 8,
                        },
                      ]}
                    >
                      <Text style={styles.btnTxt}>English</Text>
                    </AnimatedBtn>
                    <AnimatedBtn
                      onPress={() => {
                        value.chooseLanguage("russian");
                      }}
                      style={[
                        styles.btnV,
                        {
                          position: "absolute",
                          //left: animatedWidth,
                          transform: [
                            {
                              translateX: animatedLeft,
                            },
                          ],
                          top: 58,
                          marginTop: 30,
                        },
                      ]}
                    >
                      <Text style={styles.btnTxt}>РУССКИЙ</Text>
                    </AnimatedBtn>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </React.Fragment>
        )}
      </ContextConsumer>
    );
  }
}
const styles = StyleSheet.create({
  btnV: {
    marginTop: 18,
    width: 210,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#42aec2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  btnTxt: {
    fontSize: 16,
    color: "#fff",
    textTransform: "uppercase",
    fontFamily: "Montserrat-SemiBold",
  },
});
