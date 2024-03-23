import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import colors from "../../../colors";

const SkeletonLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  const renderSkeleton = () => {
    const skeletonItems = [];

    for (let i = 0; i < 6; i++) {
      const backgroundColor = useState(new Animated.Value(0))[0];

      useEffect(() => {
        const colorAnimation = Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 1000,
          delay: 100,
          useNativeDriver: false,
        });

        const loopAnimation = Animated.loop(
          Animated.sequence([colorAnimation, Animated.delay(500)])
        );

        loopAnimation.start();

        return () => {
          loopAnimation.stop();
        };
      }, [backgroundColor]);

      skeletonItems.push(
        <View key={i} style={styles.skeleton}>
          <View style={styles.leftcompo}>
            <Animated.View
              style={[
                styles.box,
                {
                  backgroundColor: backgroundColor.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", colors.deepBlue],
                  }),
                },
              ]}
            />
            <View style={styles.textcontainer}>
              <Animated.View
                style={[
                  styles.title,
                  {
                    backgroundColor: backgroundColor.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", colors.deepBlue],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.subtitle,
                  {
                    backgroundColor: backgroundColor.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["#ccc", colors.deepBlue],
                    }),
                  },
                ]}
              />
            </View>
          </View>
          <View style={[styles.rightcompo, { backgroundColor: "#ccc" }]}>
            <Animated.View
              style={[
                styles.tick,
                {
                  backgroundColor: backgroundColor.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#ccc", colors.deepBlue],
                  }),
                },
              ]}
            />
          </View>
        </View>
      );
    }

    return skeletonItems;
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  if (isLoading) {
    return <View style={styles.container}>{renderSkeleton()}</View>;
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundWhite,
  },
  skeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: "90%",
    height: "15%",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: colors.white,
  },
  leftcompo: {
    flexDirection: "row",
  },
  rightcompo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    marginVertical: "5%",
  },
  box: {
    width: 64,
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
  },
  textcontainer: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  tick: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  title: {
    width: 160,
    height: 20,
  },
  subtitle: {
    marginVertical: 10,
    width: 100,
    height: 20,
  },
});

export default SkeletonLoadingScreen;
