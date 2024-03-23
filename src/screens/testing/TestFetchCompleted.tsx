import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { client } from "../../api/Pocketbase";
import BigExamDone from "../../components/exam/BigExamDone";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RecordModel {
  id: string;
  title: string;
  time: string;
  imageUrl: string;
}
interface UserAnswer {
  quiz: string;
  score: number;
  result: string;
  username: string;
  user_id: string;
}

const TestFetchCompleted = () => {
  const [userID, setUserID] = useState("");
  const [lastExamDone, setLastExamDone] = useState<RecordModel[]>([]);
  let saveId: string;

  useEffect(() => {
    const fetchDataAndUser = async () => {
      await getUserID();
      await fetchCompletedQuiz();
    };
    fetchDataAndUser();
  }, []); // Include refreshIndicator in the dependency array

  const getUserID = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        saveId = userData.id;
        setUserID(userData.id);
        console.log("user id from asynStorage: ", saveId);
        console.log("user id from useState: ", userID);
      } else {
        console.log("NO userID in AsyncStorage");
      }
    } catch (error) {
      console.error("Error retrieving user ID from AsyncStorage:", error);
    }
  };

  const fetchCompletedQuiz = async () => {
    try {
      if (saveId) {
        const quizList: RecordModel[] = await client
          .collection("Quiz")
          .getFullList();
        const completedQuizList: UserAnswer[] = await client
          .collection("User_answer")
          .getFullList();
        const completedQuizIds = completedQuizList
          .filter((item) => item.user_id === saveId)
          .map((item) => item.quiz);

        const completedQuizzes = quizList.filter((quiz) =>
          completedQuizIds.includes(quiz.id)
        );

        setLastExamDone(completedQuizzes);
        console.log("Filtered completed quizzes:", lastExamDone);
      } else {
        console.log("can not get userID from useState");
      }
    } catch (error) {
      console.error(
        "Error fetchCompletedQuiz function in test screen  :",
        error
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Text>hello</Text>
      {lastExamDone.map((item) => (
        <BigExamDone
          key={item.id}
          image={item.imageUrl}
          title={item.title}
          subtitle={item.time}
          iconName="check"
        />
      ))}
    </View>
  );
};

export default TestFetchCompleted;
