import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  RefreshControl,
  Button
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../colors";
import { client } from "../api/Pocketbase";
import ScoreBoard from "../components/ScoreBoard";
import CurrentUser from "../components/CurrentUser";
import { UsernameAtom } from "../atom/CurrentUsername";
import { useAtom } from "jotai";

interface RecordModel {
  rank: number;
  id: string;
  title: string;
  total_score: number;
  username: string;
  name: string;
}

const Scores = () => {
  const [data, setData] = useState<RecordModel[]>([]);
  const [currentData, setCurrentData] = useState<RecordModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = useWindowDimensions();
  const [key, setKey] = useState(Date.now().toString());
  const [currentUsername, setCurrentUsername] = useAtom(UsernameAtom);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 10;

  const fetchData = async (page = 0) => {
    try {

      const currentRecord: RecordModel[] = await client
        .collection('Total_score')
        .getFullList();

        const scoresMap = new Map();

      currentRecord.forEach((record) => {
        const currentHighest = scoresMap.get(record.name);

        if (!currentHighest || record.total_score > currentHighest.total_score) {
          scoresMap.set(record.name, record);
        }
      });

      const scores = Array.from(scoresMap.values());
      const sortedScores = scores.sort((a, b) => b.total_score - a.total_score);
      const topScores = sortedScores.slice();
      setCurrentData(topScores);

      const start = page * pageSize;
      const end = start + pageSize;

      const records = await client
        .collection('Total_score')
        .getFullList();

      const highestScoresMap = new Map();

      records.forEach((record) => {
        const currentHighest = highestScoresMap.get(record.username);

        if (!currentHighest || record.total_score > currentHighest.score) {
          highestScoresMap.set(record.username, record);
        }
      });

      const highestScores = Array.from(highestScoresMap.values());
      const sortedHighestScores = highestScores.sort((a, b) => b.total_score - a.total_score);
      const top10HighestScores = sortedHighestScores.slice(start, end);
      setData(page === 0 ? top10HighestScores : [...data, ...top10HighestScores]);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setCurrentPage(0);
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  if (isLoading) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color={colors.deepBlue} />
      </View>
    );
  }

  return (
    <View key={key} style={styles.controllView}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>

        {currentData.map((item, index) => (
          item.name === currentUsername && (
            <View style={styles.examContainer} key={index}>
              <CurrentUser
                rank={index + 1}
                username={item.name}
                point={item.total_score}
                currentUsername={currentUsername}
              />
            </View>
          )
        ))}

        <View style={styles.separator} />

        {data.map((item, index) => (
          <View style={styles.examContainer} key={index}>
            <ScoreBoard
              rank={index + 1}
              username={item.name}
              point={item.total_score}
              currentUsername={''}
            />
          </View>
        ))}
        {currentPage * pageSize < data.length && (
          <Button title="Load More" onPress={handleLoadMore} />
        )}
      </ScrollView>
    </View>
  );
};

export default Scores;

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
    marginBottom: 15,
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
  },
  title2: {
    color: colors.deepBlue,
    fontSize: 16,
    fontFamily: "Medium",
  },
  separator: {
    width: 250,
    height: 5,
    backgroundColor: colors.deepBlue,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
});