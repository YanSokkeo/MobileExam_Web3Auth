import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";

import Icon from "react-native-vector-icons/Feather";

interface Props {
  iconleft?: string;
  iconfirstRight?: string;
  iconSecondRight?: string;
  IconColor?: string;
  title?: string;
  iconColorSecond?: string;
  backgroundColors?: string;
}

const CustomHeader: React.FC<Props> = (props) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={[styles.rowhead1, { backgroundColor: props.backgroundColors }]}
      >
        <TouchableOpacity>
          {props.iconleft && (
            <Icon
              name={props.iconleft}
              size={30}
              style={{ color: props.IconColor }}
            />
          )}
        </TouchableOpacity>
        <View style={styles.rowhead2}>
          <TouchableOpacity>
            {props.iconfirstRight && (
              <Icon
                name={props.iconfirstRight}
                size={30}
                style={{ color: props.IconColor }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            {props.iconSecondRight && (
              <Icon
                name={props.iconSecondRight}
                size={30}
                style={{
                  color: props.iconColorSecond,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  rowhead1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 17,
  },
  rowhead2: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
