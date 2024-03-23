import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../../../colors";
interface Props {}

const InputScreen: React.FC<Props> = (props) => {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === "android" ? 30 : 0 }}>
      <View style={{ marginHorizontal: "6%" }}>
        <Text style={styles.text}>Hello</Text>
      </View>
      <View style={styles.VInput}>
        <TextInput
          placeholder="Email"
          //   onChangeText={(text) => setEmail(text)}
          //   value={email}
          //   onFocus={handleEmailFocus}
        />
      </View>
    </View>
  );
};

export default InputScreen;

const styles = StyleSheet.create({
  VInput: {
    width: "90%",
    height: 50,
    marginHorizontal: "5%",
    marginVertical: "2.5%",
    backgroundColor: colors.white,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "bold",
    fontSize: 15,
    color: colors.deepBlue,
  },
});
