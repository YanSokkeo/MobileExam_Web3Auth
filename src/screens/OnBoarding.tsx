import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import colors from "../../colors";
import CustomButton from "../components/button/CustomButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useWeb3AuthContext } from "../context/web3auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  signin: undefined;
  tabNavigation: undefined;
  onboard: undefined;
};

const OnBoarding = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getUserinfo } = useWeb3AuthContext();

  useEffect(() => {
    const checkAndNavigate = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const userInfo = await getUserinfo();

        if (userInfo) {
          navigation.navigate("onboard");
        } else if (userData) {
          navigation.navigate("tabNavigation");
        } else {
          navigation.navigate("signin");
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAndNavigate();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container_img}>
        <Image
          style={{
            width: "100%",
            backgroundColor: colors.deepBlue,
          }}
          source={require("../../assets/images/champion.png")}
        />
      </View>

      <View style={styles.text_container}>
        <Text style={styles.title}>Do your exam test and</Text>
        <Text style={styles.title1}>get the best score</Text>
        <Text style={styles.subtitle}>
          Study and get the highest score in your class,
        </Text>
        <Text style={styles.subtitle1}>the exam won't be this fun</Text>
      </View>

      <View style={styles.button}>
        <CustomButton
          onPress={() => navigation.navigate("tabNavigation")}
          text="Get Start"
        />
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  container_img: {
    flex: 0.6,
  },
  text_container: {
    flex: 0.3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: "bold",
    color: colors.deepBlue,
  },
  title1: {
    fontSize: 20,
    fontFamily: "bold",
    color: colors.deepBlue,
  },
  subtitle: {
    paddingTop: 10,
    fontSize: 14,
    fontFamily: "Light",
    color: colors.deepBlue,
  },
  subtitle1: {
    fontSize: 14,
    fontFamily: "Light",
    color: colors.deepBlue,
  },
  button: {
    flex: 0.1,
    marginVertical: 10,
    flexDirection: "row-reverse",
  },
});
