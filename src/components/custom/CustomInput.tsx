import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../../../colors";

const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
}: any) => {
  return (
    <View>
      <View style={styles.VInput}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};

export default CustomInput;

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
  input: {},
});
