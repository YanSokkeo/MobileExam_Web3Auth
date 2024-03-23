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

const Category = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
        .collection("Quizzes_category")
        .getFullList();
      const completedQuizList: UserAnswer[] = await client
        .collection("User_answer")
        .getFullList();

      const completedQuizIds = completedQuizList
        .filter((item) => item.user_id === saveId)
        .map((item) => item.quiz);

      const uncompletedQuizzes = allQuizzes.filter(
        (quiz) => !completedQuizIds.includes(quiz.id)
      );

      setData(allQuizzes);
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
        ids.forEach((id: any) => {});
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

  const handlePress = (id: string, time: string) => {
    if (id === null) {
      console.log("nothing to see");
    } else {
      console.log("id that has been selected: ", id);
      addSelectedComponent(id);
      storeUserId(id);
      navigation.navigate("CategoryList", { id, time });
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
        {/* <View style={styles.controllBottom}>
          <View style={styles.textcontainer}>
            <Text style={styles.title2}>Exam done</Text>
          </View>
          <ExamDone
            image={require("../../assets/images/GroupDone.png")}
            title="Physics daily quiz"
            subtitle="45 Minutes"
            iconName="check"
          />
  
          {lastExamDone.map((item) => (
            <BigExamDone
              key={item.id}
              image={item.imageUrl}
              title={item.title}
              subtitle={item.time}
              iconName="check"
            />
          ))}
        </View> */}
      </ScrollView>
    </View>
  );
};

export default Category;

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
    paddingTop: 10,
  },
  title2: {
    color: colors.deepBlue,
    fontSize: 16,
    fontFamily: "Medium",
  },
});
