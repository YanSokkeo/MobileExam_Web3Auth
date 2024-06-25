import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import CustomHeader from "../components/header/CustomHeader";
import colors from "../../colors";
import SearchBox from "../components/search/SearchBox";
import BannerImage from "../components/banner/BannerImage";
import Icon from "react-native-vector-icons/Feather";
import ExamDone from "../components/exam/ExamDone";
import React, { useState, useEffect } from "react";
import { client } from "../api/Pocketbase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BigExamDone from "../components/exam/BigExamDone";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useSelectedComponent } from "../atom/SelectedComponentAtom";

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
type RootStackParamList = {
  signin: undefined;
  examlist: undefined;
  tabNavigation: undefined;
  Search: undefined;
  CategoryList: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [lastExamDone, setLastExamDone] = useState<RecordModel[]>([]);
  const [dataCategory, setDataCategory] = useState<RecordModel[]>([]);
  const [data, setData] = useState<RecordModel[]>([]);
  const { addSelectedComponent } = useSelectedComponent();
  let saveId: string = "";
  useEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);

  const handleBackButton = () => {
    if (Platform.OS === "android") {
      Alert.alert("Exit App", "Do you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Exit",
          onPress: () => BackHandler.exitApp(),
        },
      ]);
    }
    return true;
  };
  useEffect(() => {
    const fetchDataAndUser = async () => {
      await getUserID();
      await fetchData();
      if (userID) {
        await fetchCompletedQuiz();
      }
    };
    fetchDataAndUser();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserID();
      fetchCompletedQuiz();
    }, [])
  );

  const fetchData = async () => {
    try {
      const resultList = await client.collection("Quiz").getList(0, 3, {
        sort: "-created",
      });
      const quizItems: RecordModel[] = resultList.items;

      setData(quizItems);
      console.log("here is data that we fetched ", quizItems);

      const resultCategory = await client
        .collection("Quizzes_category")
        .getList(0, 3, {
          sort: "-created",
        });
      const quizCategory: RecordModel[] = resultCategory.items;

      setDataCategory(quizCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserID = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      console.log("storedData", storedUserData);
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        saveId = userData.id;
        console.log(userData);
        setUserName(userData.username);
        setName(userData.name);
        setUserID(userData.id);
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
        console.log("Filtered completed quizzes home:", lastExamDone);
      } else {
        console.log("can not get userID from useState");
      }
    } catch (error) {
      console.error(
        "Error fetchCompletedQuiz function in test screen: ",
        error
      );
    }
  };
  const handlePress = () => {
    navigation.navigate("Search");
  };

  const handlePressed = (id: string, time: string) => {
    if (id === null) {
      console.log("nothing to see");
    } else {
      console.log("id that has been selected: ", id);
      addSelectedComponent(id);
      navigation.navigate("CategoryList", { id, time });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ flex: 0.1 }}>
          <CustomHeader
            // iconleft="menu"
            // iconfirstRight="mail"
            // iconSecondRight="bell"
            IconColor={colors.deepBlue}
            iconColorSecond={colors.deepBlue}
          />
        </View>
        <TouchableOpacity onPress={handlePress}>
          {/* <SearchBox iconName="search" placeholder="Search exam test" /> */}
          <View style={styles.container2}>
            <Icon name="search" size={30} style={styles.icon} />
            <Text style={{ color: colors.lightGrey, fontSize: 16 }}>
              {" "}
              Search{" "}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.textContainer1}>
          <Text style={styles.title}>
            Hi, {name.charAt(0).toUpperCase() + name.slice(1)}
          </Text>
          <Text style={styles.subtitle}>Here your progress last week</Text>
        </View>

        <BannerImage />

        <View style={styles.textContainer1}>
          <Text style={styles.title}>Today Test</Text>
          <Text style={styles.subtitle}>Here is your test list for today</Text>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          {data.map((item) => (
            <TouchableOpacity key={item.id}>
              <ImageBackground
                source={{ uri: item.imageUrl }}
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
        <View style={styles.textContainer1}>
          <Text style={styles.title}>Quizes Categories</Text>
          <Text style={styles.subtitle}>Here is your categories list </Text>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          {dataCategory.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePressed(item.id, item.time)}
            >
              <ImageBackground
                source={{ uri: item.imageUrl }}
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

        <ScrollView>
          <View style={styles.textContainer1}>
            {userID ? (
              <View>
                <Text style={styles.title}>Last exam done</Text>
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
                <Text style={styles.title}>No Exam Done</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  container2: {
    width: "90%",
    height: 50,
    marginHorizontal: "5%",
    backgroundColor: colors.white,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
  },
  icon: {
    color: colors.deepBlue,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  textContainer1: {
    flex: 0.1,
    marginHorizontal: "5%",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Medium",
    color: colors.deepBlue,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Medium",
    color: colors.grey,
  },

  scroll: {
    width: 144,
    height: 160,
    backgroundColor: colors.brown,
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
