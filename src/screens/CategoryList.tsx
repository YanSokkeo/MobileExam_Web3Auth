import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import React from "react";
import CustomHeader from "../components/header/CustomHeader";
import colors from "../../colors";
import { Provider } from "jotai";
import SubCategory from "./SubCategory";
import HeaderBackground from "../components/header/HeaderBackground";
import { useNavigation } from "@react-navigation/native";

const CategoryList = ({ route }: any) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const handlePress = () => {
    navigation.navigate("tabNavigation");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <HeaderBackground
          iconleft="arrow-left"
          title=""
          textColor={colors.white}
          backgroundColors={colors.deepBlue}
          IconColor={colors.white}
          onPressLeft={handlePress}
        />
        {/* <CustomHeader
          iconleft="menu"
          iconfirstRight="mail"
          iconSecondRight="bell"
          IconColor={colors.white}
          iconColorSecond={colors.white}
        /> */}
        <View style={styles.textContaniner}>
          <Text style={styles.title}>Category List</Text>
          <Text style={styles.subtitle}>12th MIPA 2</Text>
        </View>
      </View>
      <Provider>
        <SubCategory route={route} />
      </Provider>
    </SafeAreaView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  head: {
    flex: 0.22,
    backgroundColor: colors.deepBlue,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  title: {
    width: 200,
    color: colors.white,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Medium",
  },
  title2: {
    color: colors.deepBlue,
    fontSize: 16,
    fontFamily: "Medium",
  },
  subtitle: {
    color: colors.white,
    textAlign: "left",
    fontSize: 14,
    fontFamily: "Medium",
  },
  textContaniner: {
    width: "30%",
    padding: 10,
    marginHorizontal: 15,
  },
  top: {
    // position: 'absolute',
    // top: 120,
    // left: 0,
    // right: 0,
    height: 110,
    marginTop: -40,
    // backgroundColor: colors.gold,
  },
  scrollViewContentContainer: {
    alignItems: "center",
    padding: 10,
  },
  examContainer: {
    marginBottom: 20,
  },

  controllView: {
    flex: 0.6,
    marginTop: -30,
  },
  textcontainer: {
    width: 150,
    padding: 10,
    margin: 10,
  },

  controllBottom: {
    flex: 0.19,
  },
});
