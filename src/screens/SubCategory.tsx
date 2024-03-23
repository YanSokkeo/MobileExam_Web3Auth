import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import BigExamDone from "../components/exam/BigExamDone";
import colors from "../../colors";
import { client } from "../api/Pocketbase";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import ExamDone from "../components/exam/ExamDone";
import SkeletonLoadingScreen from "./testing/SkeletonLoadingScreen ";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelectedComponent } from "../atom/SelectedComponentAtom";

type RootStackParamList = {
  question: undefined;
};

interface RecordModel {
  Quizzes_category_id: string;
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

const SubCategory = ({ route }: any) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { id } = route.params;
  const [data, setData] = useState<RecordModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState("");
  const { addSelectedComponent, loadSelectedComponents } =
    useSelectedComponent();
  const [refreshing, setRefreshing] = useState(false);
  const [lastExamDone, setLastExamDone] = useState<RecordModel[]>([]);
  const [uncompletedQuizzes, setUncompletedQuizzes] = useState<RecordModel[]>(
    []
  );
  let saveId: string;

  useEffect(() => {
    const fetchDataAndUser = async () => {
      await getUserID();
      if (saveId) {
        await fetchCompletedQuiz();
      }
      fetchData();
    };

    fetchDataAndUser();
    loadSelectedComponents();
    displayAllKeys();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getCompletedID();
      getUserID();
      fetchCompletedQuiz();
      loadSelectedComponents();
      displayAllKeys();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const allQuizzes: RecordModel[] = await client
        .collection("Quiz")
        .getFullList();
      // Filter the quizzes based on quiz_category_id
      const filteredQuizzes = allQuizzes.filter(
        (quiz) => quiz.Quizzes_category_id === id
      );

      setData(filteredQuizzes);

      const completedQuizList: UserAnswer[] = await client
        .collection("User_answer")
        .getFullList();

      const completedQuizIds = completedQuizList
        .filter((item) => item.user_id === saveId)
        .map((item) => item.quiz);

      const uncompletedQuizzes = filteredQuizzes.filter(
        (quiz) => !completedQuizIds.includes(quiz.id)
      );

      //   setData(allQuizzes);
      setUncompletedQuizzes(uncompletedQuizzes);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const storeUserId = async (id: any) => {
    try {
      const storedIDs = await AsyncStorage.getItem("ids");
      let updatedIDs = [];

      if (storedIDs) {
        updatedIDs = JSON.parse(storedIDs);
      }

      if (!updatedIDs.includes(id)) {
        updatedIDs.push(id);
        await AsyncStorage.setItem("ids", JSON.stringify(updatedIDs));
        console.log("User ID stored successfully");
        console.log("Have stored user ID:", id);
      } else {
        console.log("User ID already exists:", id);
      }
    } catch (error) {
      console.error("Error storing user ID:", error);
    }
  };

  const getCompletedID = async () => {
    try {
      const storedIDs = await AsyncStorage.getItem("ids");
      if (storedIDs) {
        const ids = JSON.parse(storedIDs);
        // console.log("Data associated with id:");
        ids.forEach((id: any) => {
          //   console.log("id:", id);
        });
      } else {
        console.log("No IDs found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const displayAllKeys = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log("All keys:", allKeys);
    } catch (error) {
      console.error("Error retrieving keys:", error);
    }
  };

  const getUserID = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        saveId = userData.id;
        setUserID(userData.id);
        console.log("user id from AsyncStorage: ", saveId);
        console.log("user id from useState: ", userID);
      } else {
        console.log("No userID in AsyncStorage");
        saveId = "";
        setUserID("");
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

        const filteredQuizzes = quizList.filter(
          (quiz) => quiz.Quizzes_category_id === id
        );

        const completedQuizList: UserAnswer[] = await client
          .collection("User_answer")
          .getFullList();
        const completedQuizIds = completedQuizList
          .filter((item) => item.user_id === saveId)
          .map((item) => item.quiz);

        const completedQuizzes = filteredQuizzes.filter((quiz) =>
          completedQuizIds.includes(quiz.id)
        );

        setLastExamDone(completedQuizzes);
        console.log("Filtered completed quizzes:", lastExamDone);
      } else {
        console.log("can not get userID from useState");
      }
    } catch (error) {
      console.error("Error fetchCompletedQuiz function :", error);
    }
  };

  const handlePress = (id: string, time: string) => {
    if (id === null) {
      console.log("nothing to see");
    } else {
      console.log("id that has been selected: ", id);
      addSelectedComponent(id);
      storeUserId(id);
      navigation.navigate("question", { id, time });
    }
  };

  if (isLoading) {
    return <SkeletonLoadingScreen />;
  }

  return (
    <View style={styles.controllView}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {uncompletedQuizzes.map((item, index) => (
          <BigExamDone
            key={item.id}
            image={item.imageUrl}
            title={item.title}
            subtitle={item.time}
            onPress={() => handlePress(item.id, item.time)}
            iconName="play"
          />
        ))}

        <View style={styles.controllBottom}>
          {userID ? (
            <View>
              <Text style={styles.title2}>Last exam done</Text>
              {/* <ExamDone
                  image={require("../../assets/images/GroupDone.png")}
                  title="Physics daily quiz"
                  subtitle="45 Minutes"
                  iconName="check"
                /> */}
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
          ) : (
            <View>
              <Text style={styles.title2}>No Exam Done</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SubCategory;

const styles = StyleSheet.create({
  controllView: {
    flex: 0.81,
    marginTop: -30,
  },
  scrollViewContentContainer: {
    width: "95%",
    alignSelf: "center",
    padding: 10,
  },
  examContainer: {
    marginBottom: 20,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textcontainer: {
    width: "50%",
    margin: 5,
    padding: 5,
    textAlign: "left",
  },

  controllBottom: {
    flex: 0.19,
    // paddingTop: 10,
  },
  title2: {
    color: colors.deepBlue,
    fontSize: 16,
    fontFamily: "Medium",
    marginBottom: 15,
  },
});
