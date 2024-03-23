import { StyleSheet, View, Image } from "react-native";
import React, { useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWeb3AuthContext } from "../context/web3auth";

const Logo = require("../../assets/logo1.png");
type RootStackParamList = {
  onboard: undefined;
  tabNavigation: undefined;
  signin: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getUserinfo } = useWeb3AuthContext();

  useEffect(() => {
    const checkAndNavigate = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const userInfo = await getUserinfo();

        if (userInfo && userData) {
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        style={{
          width: "100%",
          resizeMode: "contain",
        }}
        source={Logo}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
