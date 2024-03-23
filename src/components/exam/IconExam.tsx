import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import colors from "../../../colors";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  number: string;
  title: string;
  score: string;
  image: ImageSourcePropType;
  iconName?: string;
  onPress?: Function;
  color?: string;
}

const IconExam: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftcompo}>
        <Text style={styles.numberSty}>{props.number}</Text>
        <View style={styles.box}>
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
              borderRadius: 10,
            }}
            source={props.image}
          />
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subtitle}>{props.score}</Text>
        </View>
      </View>
      <View style={styles.rightcompo}>
        <Icon
          name={props.iconName ?? ''}
          size={30}
          style={styles.tick}
          color={props.color}
        />
      </View>
    </TouchableOpacity>
  );
};

export default IconExam;

const styles = StyleSheet.create({
  container: {
    width: 342,
    height: 68,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    borderRadius: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  leftcompo: {
    flexDirection: "row",
  },
  rightcompo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    // backgroundColor: colors.lightBlue,
    justifyContent: "center",
  },
  box: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  textcontainer: {
    flexDirection: "column",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  tick: {
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontFamily: "Medium",
    color: colors.deepBlue,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Medium",
    color: colors.grey,
  },
  numberSty: {
    alignSelf: "center",
    padding: 5,
    fontSize: 16,
    fontFamily: "Medium",
    color: colors.deepBlue,
  },
});
