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
import Icon from "react-native-vector-icons/FontAwesome";
interface Props {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  iconName: string;
  onPress?: () => void;
}

const ExamDone: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftcompo}>
        <View style={styles.box}>
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
              borderRadius: 10,
              backgroundColor: colors.deepBlue,
            }}
            source={props.image}
          />
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>
      </View>
      <View style={styles.rightcompo}>
        <Icon name={props.iconName} size={25} style={styles.tick} />
      </View>
    </TouchableOpacity>
  );
};

export default ExamDone;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    color: colors.deepBlue,
  },
  title: {
    fontSize: 14,
    fontFamily: "Medium",
    color: colors.deepBlue,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Medium",
  },
});
