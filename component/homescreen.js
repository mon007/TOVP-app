import React from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import NavBar from "./navBar";
import Carousel, { Pagination } from "react-native-snap-carousel";
import AsyncStorage from "@react-native-community/async-storage";

const horizontalMargin = 1;
const slideWidth = 310;

const screenHeight = Dimensions.get("window").height;
const sliderWidth = Dimensions.get("window").width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 150;

export default class Homescreen extends React.Component {
  state = {
    currentIndex: 1,
    carouselImageArr: [
      require("../src/rivers.jpg"),
      require("../src/temple.jpg"),
      require("../src/field.jpg"),
      require("../src/temple.jpg")
    ],
    news: [
      {
        title: "First Tilak Sign Mounted",
        description:
          "This is the first of many tilak signs that will be embedded onto the main dome. It stands at about 2 meters (6.5 feet) high and you can see the immense size by comparing it to the workers in the photos. We are very pleased with this temple embellishment and it will add another pleasing",
        pic: require("../src/news2.jpg")
      },
      {
        title: "The Completion of the Sri Lakshmi Devi Murti",
        description:
          "We are very happy to announce the completion of the Sri Lakshmidevi murti. Through the photos you will be able to appreciate the intricate detail of the murti and the delicate painting work that enhances Her transcendental beauty. This is one of many, many murtis of demigods the art team is working on that will",
        pic: require("../src/news1.jpg")
      },
      {
        title:
          "Lord Nityananda Visits Bangladesh for the First Time on a Historic TOVP Tour",
        description:
          "After more than 530 years, Lord Nityananda Prabhu in the form of His Padukas from Sridhama Mayapur has paid His first visit to Bangladesh due to the prayers and calling of His Holiness Jayapataka Maharaja and the sincerity, devotion, love and eagerness for His darshan by all the devotees. Jayapataka Maharaja has inspired and instilled",
        pic: require("../src/news3.jpg")
      },
      {
        title: "Main Dome Progress – June, 2019",
        description:
          "Work on the Main Dome of the TOVP is moving quickly ahead and is almost complete. In the photos you will see blue tiling has been finished along with most of the gold stars and other decorations. The trimmings around the dome such as the tilak symbols, cornices, etc. are also moving rapidly forward.",
        pic: require("../src/news4.jpg")
      }
    ],
    blog: [
      {
        title: "FOUNDER'S VISION - SRILA PRABHUPADA ABOUT TOVP",
        description:
          "Srila Prabhupada had a clear vision for the temple, and he expressed it on many occasions. He wanted a unique Vedic Planetarium to present the Vedic perspective of life..",
        pic: require("../src/blog1.jpg")
      },
      {
        title: "A Message From The Chairman",
        description:
          "Whether you are already familiar with the project, or are a new visitor, we hope that this site will be informative as well as inspiring. Sri Mayapur Chandrodaya Mandir – Temple of the Vedic Planetarium, is the World Headquarters of the International Society for Krishna Consciousness...",
        pic: require("../src/blog2.jpg")
      },
      {
        title: "JANANIVAS PRABHU SPEAKS ABOUT TOVP",
        description:
          "In March 1972, we had the first ISKCON Gaura-Purnima festival in Sridham Mayapur. During that festival, small Radha-Madhava came from Calcutta and were presiding over the program. At that time, only the bhajan-kutir was on...",
        pic: require("../src/blog3.jpg")
      },
      {
        title: "TOVP SIZE COMPARED TO SAMADHI",
        description:
          "This is a photo of the TOVP that shows its actual size and dimensions once completed, when compared to Srila Prabhupada's Pushpa Samadhi. Both will be connected by a special bridge crossing above the TOVP gardens, and both represent the crown jewels of the ISKCON Mayapur project.",
        pic: require("../src/blog4.jpg")
      }
    ],
    currentBlogIndex: 0
  };

  _renderItem = ({ item, index }) => {
    return <Image source={item} style={styles.slideInnerContainer} />;
  };
  _renderItem2 = ({ item, index }) => {
    return (
      <ImageBackground
        source={item.pic}
        style={styles.slideInnerContainer}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View
          style={{
            width: 160,
            height: 30,
            position: "absolute",
            bottom: 18,
            alignItems: "flex-end",
            right: 1
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontFamily: "Montserrat-Bold"
            }}
          >
            Read More >
          </Text>
        </View>
      </ImageBackground>
    );
  };
  async componentDidMount() {
    await AsyncStorage.setItem("userId", this.props.userId);
  }
  render() {
    return (
      <React.Fragment>
        <StatusBar backgroundColor="#fc3255" />
        <NavBar title="Home" />
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", height: 30 }} />
          <View //.................................................carousel
            style={{
              width: "100%",
              aspectRatio: 5 / 2,
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <View
              style={{
                width: "100%",
                height: "90%"
              }}
            >
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.carouselImageArr}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={1}
                onSnapToItem={currentIndex => {
                  this.setState({ currentIndex });
                }}
              />
            </View>
            <View
              style={{
                width: "100%",
                aspectRatio: 5 / 1,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Pagination
                dotsLength={this.state.carouselImageArr.length}
                activeDotIndex={this.state.currentIndex}
                containerStyle={{ width: 20, height: 20 }}
                dotStyle={{
                  width: 4,
                  height: 4,
                  borderRadius: 5,
                  marginHorizontal: 4,
                  backgroundColor: "rgba(0,0,0, 0.92)"
                }}
                inactiveDotStyle={{
                  width: 4,
                  height: 4,
                  borderRadius: 5,
                  marginHorizontal: 4,
                  backgroundColor: "grey"
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
          </View>
          <View //............................................Quote
            style={{
              width: "90%",
              aspectRatio: 5 / 1.5,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#fb6d64",
              padding: 18,
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat-Regular",
                color: "#454545"
              }}
            >
              The plans and contemplations are going on in different phases, now
              when Caitanya Mahaprabhu will be pleased it will be taken up.
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat-SemiBold",
                color: "#313131"
              }}
            >
              Srila Prabhupada A Letter to Dinesh Babu
            </Text>
            <View
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                right: -5,
                top: -5,
                width: 33,
                height: 26,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                source={require("../src/quote.png")}
                style={{ width: 18, height: 18, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: 60,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 20
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#313131",
                textTransform: "uppercase"
              }}
            >
              News
            </Text>
          </View>
          <ScrollView //........................................news
            style={{ width: "100%", aspectRatio: 5 / 4 }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {this.state.news.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={{
                  width: "90%",
                  aspectRatio: 5 / 1.5,
                  alignSelf: "center",
                  borderRadius: 8,
                  elavation: 5,
                  borderWidth: 0.1,
                  flexDirection: "row",
                  marginBottom: 18
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <Image
                    source={item.pic}
                    style={{
                      width: 90,
                      height: 120,
                      position: "absolute",
                      left: -18,
                      top: -18,
                      borderRadius: 8
                    }}
                  />
                </View>
                <View style={{ flex: 2, padding: 10 }}>
                  <View
                    style={{
                      flex: 0.6,
                      justifyContent: "center",
                      alignItems: "flex-start"
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 16,
                        color: "#313131"
                      }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      paddingTop: 2
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: 14,
                        color: "#454545"
                      }}
                      numberOfLines={3}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View
            style={{
              width: "100%",
              aspectRatio: 5 / 3,
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <View //.................................................carousel blog
              style={{
                width: "100%",
                aspectRatio: 5 / 3,
                justifyContent: "center",
                marginTop: 10
              }}
            >
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.blog}
                renderItem={this._renderItem2}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                firstItem={0}
                onSnapToItem={currentBlogIndex => {
                  this.setState({ currentBlogIndex });
                }}
              />

              <View
                style={{
                  width: "100%",
                  aspectRatio: 10 / 1,
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Pagination
                  dotsLength={this.state.blog.length}
                  activeDotIndex={this.state.currentBlogIndex}
                  containerStyle={{ width: 20, height: 20 }}
                  dotStyle={{
                    width: 4,
                    height: 4,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor: "rgba(0,0,0, 0.92)"
                  }}
                  inactiveDotStyle={{
                    width: 4,
                    height: 4,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor: "grey"
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  aspectRatio: 6 / 1,
                  paddingLeft: 10,
                  justifyContent: "center"
                }}
              >
                <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 18 }}>
                  {this.state.blog[this.state.currentBlogIndex].title}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              aspectRatio: 5 / 1,
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: 10
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: 14,
                color: "#454545"
              }}
              numberOfLines={3}
            >
              {this.state.blog[this.state.currentBlogIndex].description}
            </Text>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: screenHeight,
    backgroundColor: "#fff"
  },
  slide: {
    width: itemWidth,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalMargin
    // other styles for the item container
  },
  slideInnerContainer: {
    resizeMode: "cover",
    width: slideWidth,
    height: itemHeight,
    borderRadius: 6
    // other styles for the inner container
  },
  txt: { color: "#fff", fontSize: 14, textTransform: "capitalize" }
});
