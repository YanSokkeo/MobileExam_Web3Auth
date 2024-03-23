import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import colors from "../../../colors";

const BannerImage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.text_container}>
        <Text numberOfLines={2} style={styles.text}>
          You beat 95% of the other students
        </Text>
        <TouchableOpacity>
          <Text style={styles.more}>Read more</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.Image_container}>
        <Image
          source={require("../../../assets/images/Human.png")}
          style={{ resizeMode: "cover" }}
        />
      </View>
    </View>
  );
};

export default BannerImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.deepBlue,
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },

  text_container: {
    width: "58%",
    height: "100%",
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
  more: {
    paddingTop: 10,
    color: colors.white,
    textDecorationLine: "underline",
  },
  Image_container: {
    width: "42%",
    height: "80%",
    backgroundColor: colors.lightAbitBlue,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
});
