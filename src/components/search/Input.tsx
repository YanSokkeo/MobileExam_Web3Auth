import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import colors from "../../../colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface Props {
  label: string;
  iconName?: string;
  error?: string;
  password?: string | number;
  keyboardType?: "numeric";
  placeholder: string;
  secureTextEntry?: boolean;
  headIcon?: string;
  onChangeText?: (value: any) => void;
}

const Input: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.controll_label}>
        <FontAwesome
          name={props.headIcon ?? ""}
          size={25}
          style={styles.iconHead}
        />
        <Text style={styles.label}> {props.label} </Text>
      </View>
      <View style={styles.container2}>
        <TextInput
          keyboardType={props.keyboardType}
          placeholder={props.placeholder}
          placeholderTextColor={colors.grey}
          secureTextEntry={props.secureTextEntry}
          style={styles.Textput}
          onChangeText={props.onChangeText}
        />
        <FontAwesome
          name={props.iconName ?? ""}
          size={20}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    margin: 15,
  },
  icon: {
    color: colors.grey,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  iconHead: {
    color: colors.deepBlue,
    // marginRight: (0),
    marginHorizontal: 5,
  },
  container2: {
    backgroundColor: colors.white,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.deepBlue,
    alignItems: "center",
  },

  label: {
    // marginVertical: (0),
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.deepBlue,
  },

  Textput: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.grey,
    // placeholderTextColor: defaultColor.Smoke,
  },
  controll_label: {
    flexDirection: "row",
  },
});
