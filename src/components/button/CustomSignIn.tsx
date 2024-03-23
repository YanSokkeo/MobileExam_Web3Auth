import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../../colors";

const CustomSignIn = ({ onPress, text, type, bgcolor, fgcolor }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgcolor ? { backgroundColor: bgcolor } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgcolor ? { color: fgcolor } : {},
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomSignIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightAbitBlue,
    width: "90%",
    marginHorizontal: "5%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  container_PRIMARY: {
    backgroundColor: colors.lightAbitBlue,
  },
  container_TERTIARY: {
    backgroundColor: colors.backgroundWhite,
  },
  text: {
    fontWeight: "bold",
    color: colors.white,
  },
  text_TERTIARY: {
    color: colors.grey,
  },
});
