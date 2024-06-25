import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ImageBackground,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useReducer, useState, useEffect, useMemo } from "react";
import colors from "../../colors";
import HeaderBackground from "../components/header/HeaderBackground";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import CustomSignIn from "../components/button/CustomSignIn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { client, signout } from "../api/Pocketbase";
import CustomAlert from "../components/modal/CustomAlert ";
// import { useWeb3AuthContext } from "../context/web3auth";
// import { OpenloginUserInfo } from "@web3auth/react-native-sdk";
import { useWalletContext } from "../context/wallet";

type RootStackParamList = {
  signin: undefined;
};

interface UserModal {
  name: string;
}

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setID] = useState("");
  // const [address, setAddress] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState<UserModal[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { logout, address, walletClient } = useWalletContext();

  const updateProfile = () => {
    forceUpdate();
  };

  useEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUsername(userData.username);
            setEmail(userData.email);
            setName(userData.name);
            setID(userData.id);
            setIsVerified(userData.verified);
            setData(userData);
          }
        } catch (error) {
          console.error("Error retrieving user data from AsyncStorage:", error);
        }
      };
      fetchData();
    }, [])
  );

  const hasUserData = useMemo(
    () => username && name && email,
    [username, name, email]
  );

  const handleConfirmLeave = async () => {
    try {
      signout();
      await logout();
      updateProfile();
      console.log("User has been logged out");
      navigation.navigate("signin");
    } catch (error) {
      console.log(error);
    }
    setShowAlert(false);
  };

  const handleCancelLeave = () => {
    setShowAlert(false);
  };

  const handleLogout = async () => {
    setShowAlert(true);
  };

  const verifyEmail = async () => {
    try {
      if (!isVerified) {
        await client.collection("users").requestVerification(email);
        Alert.alert("Verification email sent", "Check your email to verify.");
      } else {
        Alert.alert(
          "Email already verified",
          "Your email is already verified."
        );
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      Alert.alert("Error", "Something went wrong! Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <HeaderBackground
          // iconleft="menu"
          // iconfirstRight="share-2"
          title="user Information"
          textColor={colors.white}
          backgroundColors={colors.deepBlue}
          IconColor={colors.white}
          secondColor={colors.white}
        />
      </View>
      <CustomAlert
        visible={showAlert}
        message="Are you sure? Do you want to LogOut?"
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
      <ScrollView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../assets/images/Background.jpg")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.imageView}>
            <Image
              style={styles.profile}
              source={require("../../assets/images/Profile.jpg")}
            />
          </View>
        </ImageBackground>
        <View style={styles.card}>
          <View style={{ marginTop: 15, marginLeft: "5%" }}>
            {/* <Text style={styles.txtG}>General</Text> */}
            <Text style={styles.txtG}>General</Text>
          </View>
          {/* <View style={{ marginTop: 10, marginLeft: "5%" }}>
            <Text style={styles.txtadd}>Wallet Address</Text>
          </View> */}
          {/* the address get address from walletprovider */}
          {/* <View style={styles.txtView}>
            <Text style={styles.txtFilladd}>
              {hasUserData ? walletClient?.account?.address : "address"}
              {address}
            </Text>
          </View> */}
          <View style={{ marginTop: 10, marginLeft: "5%" }}>
            <Text style={styles.txt}>Name</Text>
          </View>
          <View style={styles.txtView}>
            <Text style={styles.txtFill}>{hasUserData ? name : "name"}</Text>
          </View>
          <View style={{ marginTop: 10, marginLeft: "5%" }}>
            <Text style={styles.txt}>Username</Text>
          </View>
          <View style={styles.txtView}>
            <Text style={styles.txtFill}>
              {hasUserData ? username : "username"}
            </Text>
          </View>
          <View style={{ marginTop: 10, marginLeft: "5%" }}>
            <Text style={styles.txt}>Email</Text>
          </View>
          <View style={styles.txtView}>
            <Text style={styles.txtFill}>
              {hasUserData ? email : "example@gmil.com"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "6%",
              marginVertical: "5%",
            }}
          >
            <Text style={styles.text}>
              Verify: {isVerified ? "True" : "False"}
            </Text>
            <Pressable
              style={[
                styles.roundedContainer,
                isVerified ? styles.disabled : null,
              ]}
              onPress={verifyEmail}
              disabled={isVerified}
            >
              <Text style={styles.text}>Verify email</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 100 }}>
            <View style={styles.button}>
              <CustomSignIn
                onPress={handleLogout}
                text={"Log out"}
                type={undefined}
                bgcolor={undefined}
                fgcolor={undefined}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  disabled: {
    opacity: 0.5,
  },
  roundedContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "lightgray",
  },
  image: {
    flex: 0.3,
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  imageView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flex: 0.3,
    marginVertical: "7%",
  },
  profile: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  card: {
    width: "90%",
    height: "100%",
    marginHorizontal: "5%",
    marginVertical: 20,
    flex: 0.6,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  txtG: {
    fontSize: 20,
    color: colors.lightAbitBlue,
    fontFamily: "bold",
  },
  txt: {
    fontSize: 18,
    color: colors.lightAbitBlue,
    fontFamily: "Light",
  },
  txtadd: {
    fontSize: 18,
    color: colors.lightAbitBlue,
    fontFamily: "Light",
  },
  text: {
    fontSize: 15,
    color: colors.lightAbitBlue,
    fontFamily: "Light",
  },
  txtFill: {
    fontSize: 16,
    paddingLeft: 10,
    color: colors.grey,
    fontFamily: "Light",
  },
  txtFilladd: {
    fontSize: 12,
    paddingLeft: 10,
    color: colors.deepBlue,
    fontFamily: "Light",
  },
  button: {
    flex: 0.5,
  },
  txtView: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    marginHorizontal: "5%",
    borderColor: colors.grey,
    borderRadius: 10,
    borderWidth: 1,
  },
});
