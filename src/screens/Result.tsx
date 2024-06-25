import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  Platform,
} from "react-native";
import colors from "../../colors";
import HeaderBackground from "../components/header/HeaderBackground";
import { client, createUserScore } from "../api/Pocketbase";
import { CurrentQuestionIndexAtom } from "../atom/CurrentQuestionIndexAtom";
import { useAtom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  tabNavigation: undefined;
};

interface UserAnswerModal {
  id: string;
  quiz: string;
  score: number;
}
const Result = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { answers, userAnswers, isAnswerCorrect, point, quiz_id, user_result } =
    route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    CurrentQuestionIndexAtom
  );
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUsername(userData.username);
        setName(userData.name);
        setUserID(userData.id);
        console.log("user id is", userID);
        console.log("user Username is ", username);
        console.log("user name is ", name);
      }
    } catch (error) {
      console.log("Error retrieving user data from AsyncStorage:", error);
    }
  };

  const handleContinue = async () => {
    try {
      await createUserScore({
        name: name,
        username: username,
        quiz_id,
        point,
        user_result: userResult,
        user_id: userID,
      });
      navigation.navigate("tabNavigation");
    } catch (error) {
      console.log(error);
    }
    setCurrentQuestionIndex(0);
    // return;
  };

  useEffect(() => {
    const disableBackButton = () => true;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      disableBackButton
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const UserAnswer: Array<UserAnswerModal> = await client
        .collection("User_answer")
        .getFullList();
    };
  }, []);

  let trueCount = 0;
  let falseCount = 0;
  const filteredAnswers = answers.filter(
    (answer: any) => answer === true || answer === false
  );
  filteredAnswers.forEach((answer: any) => {
    if (answer === true) {
      trueCount++;
    } else if (answer === false) {
      falseCount++;
    }
  });
  const totalCount = trueCount + falseCount;
  const truePercentage = (trueCount / totalCount) * 100;
  let userResult = "";

  if (truePercentage >= 70) {
    userResult = "Passed";
  } else {
    userResult = "Failed";
  }
  console.log("True count:", trueCount);
  console.log("False count:", falseCount);
  console.log("Total count:", totalCount);

  console.log(filteredAnswers);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navigator}>
        <HeaderBackground
          // iconleft="menu"
          // iconfirstRight="share-2"
          title="Your Result's Test"
          textColor={colors.white}
          backgroundColors={colors.deepBlue}
          IconColor={colors.white}
          secondColor={colors.white}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.score}>
          <View style={styles.circle}>
            <Text style={styles.text}>{truePercentage.toFixed(2)}%</Text>
          </View>
          <View style={{ flexDirection: "row-reverse" }}>
            <Text style={[styles.text1, { marginLeft: 20 }]}>
              False: {falseCount}
            </Text>
            <Text style={styles.text1}> True {trueCount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Results</Text>
          <ScrollView style={{ flex: 0.5 }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {filteredAnswers.map((isCorrect: boolean, index: number) => (
                <Text
                  key={index}
                  style={[styles.answerText, { width: "50%" }]}
                  numberOfLines={index >= 2 ? 1 : undefined}
                >
                  Q{index + 1}: {isCorrect ? "Correct" : "Incorrect"}
                </Text>
              ))}
            </View>
          </ScrollView>
          <View style={styles.controll_button}>
            {truePercentage >= 70 ? (
              <Text style={styles.congratsText}>
                Congratulations, you passed the Test!
              </Text>
            ) : (
              <Text style={styles.falseText}>
                Try again, you didn't pass the Test!
              </Text>
            )}
            <Text style={styles.note}>Noted: You must get more than 70% to pass the test.</Text>
            <Text style={styles.title}>Your Points: {point}</Text>

            <TouchableOpacity onPress={handleContinue} style={styles.button}>
              <Text style={styles.text_BTN}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },

  answerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  answerText: {
    fontSize: 16,
    color: colors.deepBlue,
    fontFamily: "Medium",
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: "row",
    textAlign: "center",
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 18,
    color: colors.green,
    fontFamily: "Medium",
    textAlign: "center",
  },
  falseText: {
    fontSize: 18,
    color: colors.red,
    fontFamily: "Medium",
    textAlign: "center",
  },
  text: {
    fontSize: 25,
    color: colors.white,
    fontFamily: "Medium",
  },
  text1: {
    fontSize: 18,
    color: colors.deepBlue,
    fontFamily: "Medium",
    textAlign: "center",
  },
  text_BTN: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    width: "50%",
    height: "50%",
    backgroundColor: colors.deepBlue,
    padding: 8,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    justifyContent: "center",
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  navigator: {
    flex: 0.1,
  },
  body: {
    flex: 0.9,
    margin: 10,
  },
  score: {
    flex: 0.26,
  },
  circle: {
    width: "40%",
    height: "85%",
    borderRadius: 100,
    backgroundColor: colors.deepBlue,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: colors.deepBlue,
    fontFamily: "Medium",
    textAlign: "center",
  },
  note: {
    fontSize: 20,
    color: "orange",
    fontFamily: "Medium",
    textAlign: "center",
  },
  card: {
    flex: 0.74,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 10,
  },
  controll_button: {
    flex: 0.2,
    justifyContent: "flex-end",
  },
});
