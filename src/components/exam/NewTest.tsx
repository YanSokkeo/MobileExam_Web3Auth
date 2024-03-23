import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../../colors";
import Icon from "react-native-vector-icons/Feather";
import { client } from "../../api/Pocketbase";

interface RecordModel {
  id: string;
  title: string;
  time: string;
  imageUrl: string;
}

const NewTest = () => {
  const [data, setData] = useState<RecordModel[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resultList = await client.collection("Quiz").getList(0, 3, {
        sort: "-created",
      });
      const quizItems: RecordModel[] = resultList.items;

      setData(quizItems);
      console.log("here is data that we fetched ", quizItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      {data.map((item) => (
        <TouchableOpacity key={item.id}>
          <ImageBackground
            // source={{ uri: item.imageUrl }}
            source={require("../../../assets/images/1.png")}
            style={styles.scroll}
          >
            <View style={styles.centerAlign}>
              <View style={styles.viewInsideImage}>
                <Text numberOfLines={2} style={styles.textimg}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="clock" size={20} color={colors.white} />
                  <Text style={styles.timeText}>{item.time} Minutes</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NewTest;

const styles = StyleSheet.create({
  scroll: {
    width: 144,
    height: 160,
    backgroundColor: colors.gold,
    margin: 10,
  },

  centerAlign: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewInsideImage: {
    marginTop: 50,
    width: 124,
    height: 92,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.deepBlue,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  textimg: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Medium",
    textAlign: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    color: colors.white,
    fontSize: 12,
    fontFamily: "Medium",
  },
  scrollViewContentContainer: {
    alignItems: "center",
  },
});
