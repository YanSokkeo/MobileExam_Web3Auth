import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import colors from "../../colors";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAtom } from "jotai";
import { UsernameAtom } from "../atom/CurrentUsername";

interface Props {
  userId?: any;
  rank?: number;
  username?: string;
  name?: string;
  point?: string;
  image?: string;
  onPress?: () => void;
}

const CurrentUser: React.FC<Props & { currentUsername: string }> = (props) => {
  const [currentUsername, setCurrentUsername] = useAtom(UsernameAtom);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setCurrentUsername(userData.name);
      }
    } catch (error) {
      console.error("Error retrieving user data from AsyncStorage:", error);
    }
  };

  const renderTrophy = () => {
    const { rank } = props;

    if (rank === 1) {
      return <Icon name="ribbon-outline" size={40} color="gold" />;
    } else if (rank === 2) {
      return <Icon name="ribbon-outline" size={40} color="silver" />;
    } else if (rank === 3) {
      return <Icon name="ribbon-outline" size={40} color="brown" />;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftcompo}>
        <View
          style={{ width: 18, justifyContent: "center", marginHorizontal: 5 }}
        >
          <Text style={styles.rank}>{props.rank}</Text>
        </View>
        <View style={styles.box}>
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "cover",
              borderRadius: 10,
              backgroundColor: colors.deepBlue,
            }}
            source={{ uri: props.image }}
          />
        </View>

        <View style={styles.textcontainer}>
          {currentUsername === props.username && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.username}>{props.username}</Text>
              <View
                style={{
                  width: 32,
                  height: 14,
                  backgroundColor: colors.deepBlue,
                  borderRadius: 5,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 11,
                    fontFamily: "Medium",
                    alignSelf: "center",
                  }}
                >
                  YOU
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.point}>{props.point} Points</Text>
        </View>
      </View>
      <View
        style={{ width: 40, justifyContent: "center", marginHorizontal: 5 }}
      >
        {renderTrophy()}
      </View>
    </View>
  );
};

export default CurrentUser;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
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
  box: {
    width: 74,
    height: 74,
    borderRadius: 5,
    justifyContent: "center",
  },
  textcontainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  rank: {
    width: 50,
    color: colors.deepBlue,
    alignItems: "center",
    fontFamily: "Medium",
    fontSize: 18,
  },
  username: {
    width:  160,
    marginStart: -15,
    fontSize: 16,
    fontFamily: "Medium",
    color: colors.deepBlue,
  },
  point: {
    marginStart: -15,
    color: colors.grey,
    fontSize: 11,
    fontFamily: "Medium",
  },
});
