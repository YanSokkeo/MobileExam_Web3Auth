import { StyleSheet, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/OnBoarding";
import ExamList from "../screens/ExamList";
import LeaderBoard from "../screens/LeaderBoard";
import TabNavigation from "./TabNavigation";
import Category from "../screens/Category";
import Question from "../screens/Question";
import Result from "../screens/Result";
import Register from "../screens/Authentication/Register";
import SignIn from "../screens/Authentication/SignIn";
import ForgetPassword from "../screens/Authentication/ForgetPassword";
import CategoryList from "../screens/CategoryList";
import Search from "../screens/Search";
import * as Linking from "expo-linking";
import SplashScreen from "../screens/SplashScreen";

const prefix = Linking.createURL("/");
const linking = {
  prefixes: [prefix],
};

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer linking={linking} fallback={''}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="splashscreen" component={SplashScreen} />
        <Stack.Screen name="signin" component={SignIn} />
        <Stack.Screen name="onboard" component={OnBoarding} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="forgetPassword" component={ForgetPassword} />
        <Stack.Screen name="tabNavigation" component={TabNavigation} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="examlist" component={ExamList} />
        <Stack.Screen name="leaderboard" component={LeaderBoard} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="CategoryList" component={CategoryList} />
        <Stack.Screen name="question" component={Question} />
        <Stack.Screen name="result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
