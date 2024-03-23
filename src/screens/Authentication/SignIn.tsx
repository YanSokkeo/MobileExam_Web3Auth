import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../../../colors";
import CustomSignIn from "../../components/button/CustomSignIn";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { signIn } from "../../api/Pocketbase";

import { useWeb3AuthContext } from "../../context/web3auth";
import {
  LOGIN_PROVIDER,
  LOGIN_PROVIDER_TYPE,
} from "@web3auth/react-native-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import app from "../../../app.json";

type RootStackParamList = {
  register: undefined;
  tabNavigation: undefined;
  forgetPassword: undefined;
  onboard: undefined;
  signin: undefined;
};

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, walletClient } = useWeb3AuthContext();

  const resolvedRedirectUrl =
    Constants.appOwnership == AppOwnership.Expo ||
    Constants.appOwnership == AppOwnership.Guest
      ? Linking.createURL("onboard", {})
      : Linking.createURL("onboard", { scheme: app.expo.scheme });

  useEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);

  const handleSignIn = async (provider: LOGIN_PROVIDER_TYPE) => {
    try {
      setLoading(true);
      console.log("resolvedRedirectUrl", resolvedRedirectUrl);
      const userInfo = await login(provider, {
        redirectUrl: resolvedRedirectUrl,
      });
      if (userInfo) {
        console.log(userInfo);
        setIsLogin(true);
        const address = (await walletClient?.getAddresses())?.at(0);

        // create user record after signed in
        try {
          await signIn({
            email: userInfo.email,
            username: userInfo.name,
            profile: userInfo.profileImage,
            address: address,
          });
          console.log("Scuess!!!");
          navigation.navigate("onboard");
        } catch (err) {
          console.error(err);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={require("../../../assets/images/logo1.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textStatus}>
          <Text style={styles.text}> Please Login to Your Account </Text>
        </View>

        <View style={styles.button}>
          <CustomSignIn
            onPress={() => handleSignIn(LOGIN_PROVIDER.FACEBOOK)}
            disabled={loading}
            text={"Sign In with Facebook"}
            type={undefined}
            bgcolor="#99CCFF"
            fgcolor="#4765A9"
          />

          <CustomSignIn
            onPress={() => handleSignIn(LOGIN_PROVIDER.GOOGLE)}
            disabled={loading}
            text="Sign In with Google"
            type={undefined}
            bgcolor="#FFCC99"
            fgcolor="#DD4D44"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  horizontal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  imageView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flex: 0.2,
    marginTop: "7%",
    //backgroundColor: colors.gold,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 75,
    padding: "auto",
    margin: "auto",
  },
  button: {
    flex: 0.5,
    width: "100%",
    height: 400,
    justifyContent: "center",
  },
  textStatus: {
    marginTop: 20,
    flex: 0.1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontFamily: "Medium",
    color: colors.deepBlue,
    marginBottom: 15,
  },
});
