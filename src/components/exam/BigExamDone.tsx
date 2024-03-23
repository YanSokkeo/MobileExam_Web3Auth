import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../../../colors";
import Icon from "react-native-vector-icons/FontAwesome";

interface Props {
  title?: string;
  subtitle?: string;
  // image: ImageSourcePropType;
  image?: string;
  time?: string;
  iconName?: string;
  onPress?: () => void;
}

const BigExamDone: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.container}>
      <View style={styles.leftcompo}>
        <View style={styles.box}>
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "cover",
              borderRadius: 10,
              backgroundColor: colors.deepBlue,
            }}
            // source={props.image}
            source={{ uri: props.image }}
          />
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subtitle}>{props.subtitle} minutes</Text>
        </View>
      </View>
      <View style={styles.rightcompo}>
        <Icon name={props.iconName ?? ""} size={20} style={styles.tick} />
      </View>
    </TouchableOpacity>
  );
};

export default BigExamDone;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 68,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    borderRadius: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: "5%",
  },
  leftcompo: {
    flexDirection: "row",
  },
  rightcompo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
  },
  box: {
    width: 74,
    height: 74,
    borderRadius: 5,
    // marginRight: 10,
    justifyContent: "center",
  },
  textcontainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  tick: {
    alignSelf: "center",
    color: colors.deepBlue,
  },
  title: {
    fontSize: 14,
    fontFamily: "Medium",
    color: colors.deepBlue,
  },
  subtitle: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: "Medium",
  },
});
