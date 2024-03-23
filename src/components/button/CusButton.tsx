import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../../../colors";

interface Props {
  text: string;
  onPress?: () => void;
}

const CusButtom: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}> {props.text} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CusButtom;
const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 10,
    // paddingVertical: 14,
    // paddingHorizontal: 10,
    backgroundColor: colors.deepBlue,
    margin: 17,
    padding: 10,
  },
  buttonText: {
    color: colors.white,
    fontFamily: "bold",
    textTransform: "uppercase",
    fontSize: 18,
    textAlign: "center",
  },
});
