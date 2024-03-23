import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../colors";
import SearchBox from "../components/search/SearchBox";
import { client } from "../api/Pocketbase";
import { useAtom } from "jotai";
import { SearchQuery } from "../atom/SearchQuery";
import BigExamDone from "../components/exam/BigExamDone";
import { RecordModel } from "pocketbase";
import HeaderBackground from "../components/header/HeaderBackground";
import { useNavigation } from "@react-navigation/native";
import { useSelectedComponent } from "../atom/SelectedComponentAtom";

interface QuizItem {
  id: string;
  imageUrl: string;
  title: string;
  time: string;
}

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useAtom(SearchQuery);
  const [data, setData] = useState<QuizItem[]>([]);
  const [filteredData, setFilteredData] = useState<QuizItem[]>([]);
  const navigation = useNavigation();
  const { addSelectedComponent } = useSelectedComponent();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const allQuizzes: RecordModel[] = await client
        .collection("Quizzes_category")
        .getFullList();

      // Map the data from RecordModel to QuizItem
      const mappedQuizzes: QuizItem[] = allQuizzes.map((quiz) => ({
        id: quiz.id,
        imageUrl: quiz.imageUrl,
        title: quiz.title,
        time: quiz.time,
      }));

      setData(mappedQuizzes);
      setFilteredData(mappedQuizzes); // Initialize filteredData with all data
      console.log("All Quizzes:", mappedQuizzes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data when searchQuery changes
    const filteredResults = data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [searchQuery, data]);

  const handleLeft = () => {
    navigation.goBack();
  };

  const handlePress = (id: string, time: string) => {
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
      <View>
        <HeaderBackground
          iconleft="arrow-left"
          title="Search     "
          textColor={colors.white}
          backgroundColors={colors.deepBlue}
          IconColor={colors.white}
          onPressLeft={handleLeft}
        />
      </View>
      <View>
        <SearchBox iconName="search" placeholder="Search exam test" />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          style={styles.flatList}
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BigExamDone
              key={item.id}
              image={item.imageUrl}
              title={item.title}
              subtitle={item.time}
              onPress={() => handlePress(item.id, item.time)}
              iconName="play"
            />
          )}
          ListEmptyComponent={<Text>No results found</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  flatList: {
    marginTop: 80,
    paddingHorizontal: "5%",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
