import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Feather";

interface Props {
  iconleft?: string;
  iconfirstRight?: string;
  IconColor?: string;
  title?: string;
  backgroundColors?: string;
  secondColor?: string;
  textColor?: string;
  onPressLeft?: () => void;
}

const HeaderBackground: React.FC<Props> = (props) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={[styles.rowhead1, { backgroundColor: props.backgroundColors }]}
      >
        <TouchableOpacity onPress={props.onPressLeft}>
          {props.iconleft && (
            <Icon
              name={props.iconleft}
              size={30}
              style={{ color: props.IconColor }}
            />
          )}
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: props.textColor }]}>
            {props.title}
          </Text>
        </View>
        <View style={styles.rowhead2}>
          <TouchableOpacity>
            {props.iconfirstRight && (
              <Icon
                name={props.iconfirstRight}
                size={30}
                style={{
                  color: props.secondColor,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HeaderBackground;

const styles = StyleSheet.create({
  rowhead1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 17,
  },
  rowhead2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "Medium",
  },
});
