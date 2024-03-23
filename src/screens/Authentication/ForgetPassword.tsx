import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React from "react";
import colors from "../../../colors";
import HeaderBackground from "../../components/header/HeaderBackground";
import CustomSignIn from "../../components/button/CustomSignIn";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { client } from "../../api/Pocketbase";

type RootStackParamList = {
  signin: undefined;
};
const ForgetPassword = () => {
  const [email, setEmail] = React.useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlepress = async () => {
    try {
      await client.collection("users").requestPasswordReset(email);
      alert("Check your Email to Reset the password");
      setEmail("");
      navigation.navigate("signin");
    } catch (error) {
      // Handle the error
      alert("Something went wrong! Please try again later.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <HeaderBackground
            iconleft="arrow-left"
            title="FORGET PASSWORD "
            textColor={colors.white}
            backgroundColors={colors.deepBlue}
            IconColor={colors.white}
            onPressLeft={navigation.goBack}
          />
        </View>
        <View style={{ flex: 0.2 }}>
          <View style={styles.box}>
            <Image
              source={require("../../../assets/images/lock1.png")}
              style={{
                width: "100%",
                aspectRatio: 1,
                resizeMode: "cover",
                borderRadius: 10,
                alignSelf: "center",
              }}
            />
          </View>
        </View>
        <View style={{ marginHorizontal: "6%" }}>
          <Text style={styles.text}>
            Enter your Email to Reset the password
          </Text>
        </View>
        <View style={styles.component1}>
          <View style={styles.VInput}>
            <TextInput
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View>
          <CustomSignIn
            onPress={handlepress}
            text={"RESET NOW"}
            type={undefined}
            bgcolor={colors.deepBlue}
            fgcolor={colors.white}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  box: {
    width: "100%",
    alignSelf: "center",
  },
  VInput: {
    width: "90%",
    height: 50,
    marginHorizontal: "5%",
    marginVertical: "2.5%",
    backgroundColor: colors.white,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  component1: {
    flex: 0.1,
    padding: "auto",
    margin: "auto",
  },
  text: {
    fontFamily: "bold",
    fontSize: 15,
    color: colors.deepBlue,
  },
});
