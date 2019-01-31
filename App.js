import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  PanResponder,
  Dimensions
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const IMAGES = [
  { id: 1, uri: require("./assets/1.jpg") },
  { id: 2, uri: require("./assets/2.jpg") },
  { id: 3, uri: require("./assets/3.jpg") },
  { id: 4, uri: require("./assets/4.jpg") },
  { id: 5, uri: require("./assets/5.jpg") }
];

export default class App extends React.Component {
  constructor() {
    super();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    });

    this.rotateAndTranslate = {
      transform: [
        { rotate: this.rotate },
        ...this.position.getTranslateTransform()
      ]
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp"
    });

    this.nopeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp"
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        //
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        //
        if (
          gestureState.dx > 120 &&
          this.state.currentIndex < IMAGES.length - 1
        ) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else if (
          gestureState.dx < -120 &&
          this.state.currentIndex < IMAGES.length - 1
        ) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
        }
      }
    });
  }

  renderImage = () => {
    return IMAGES.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null;
      } else if (i === this.state.currentIndex) {
        return (
          <Animated.View
            {...this._panResponder.panHandlers}
            key={item.id}
            style={[
              this.rotateAndTranslate,
              {
                position: "absolute",
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                elevation: 3
              }
            ]}
          >
            <Animated.View
              style={[
                { opacity: this.likeOpacity },
                {
                  position: "absolute",
                  top: 50,
                  left: 40,
                  zIndex: 100,
                  transform: [
                    {
                      rotate: "-30deg"
                    }
                  ]
                }
              ]}
            >
              <Text
                style={{
                  color: "green",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "green"
                }}
              >
                LIKE
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                { opacity: this.nopeOpacity },
                {
                  position: "absolute",
                  top: 50,
                  right: 40,
                  zIndex: 100,
                  transform: [
                    {
                      rotate: "30deg"
                    }
                  ]
                }
              ]}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "red"
                }}
              >
                NOPE
              </Text>
            </Animated.View>
            <Image
              source={item.uri}
              style={{
                width: null,
                height: null,
                flex: 1,
                resizeMode: "cover",
                borderRadius: 20
              }}
            />
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[
              {
                transform: [
                  {
                    scale: this.nextCardScale
                  }
                ],
                opacity: this.nextCardOpacity
              },
              {
                position: "absolute",
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10
              }
            ]}
          >
            <Image
              source={item.uri}
              style={{
                width: null,
                height: null,
                flex: 1,
                resizeMode: "cover",
                borderRadius: 20
              }}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }} />
        <View style={{ flex: 1 }}>{this.renderImage()}</View>
        <View style={{ height: 60 }} />
      </View>
    );
  }
}
