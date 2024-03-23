import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import colors from "../../../colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CustomSignIn from "../../components/button/CustomSignIn";
import { signUp } from "../../api/Pocketbase";

type RootStackParamList = {
  signin: undefined;
};

const Register = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [userConfirm, setUserConfirm] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateUsername = () => {
    if (userName.length === 0) {
      setUsernameError("Username cannot be empty");
      return false;
    } else if (userName.length < 5) {
      setUsernameError("Username must have at least 5 characters");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validateEmail = () => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(userEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    if (userPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (userConfirm !== userPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handlerRegister = async () => {
    if (
      !validateUsername() ||
      !validateEmail() ||
      !validatePassword() ||
      !validateConfirmPassword()
    ) {
      return; // Prevent registration if validation fails
    }

    try {
      await signUp({
        username: userName,
        user_email: userEmail,
        user_password: userPassword,
        user_ConfirmPassword: userConfirm,
      });
      navigation.navigate("signin");
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setUserConfirm("");
      console.log("Register Scuess!!!");
    } catch (error) {
      console.error(error);
    }
  };

  const onRegisterPressed = () => {
    console.warn("Register");
  };
  const hanldeGoSignin = () => {
    navigation.navigate("signin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.txtView}>
          <Text style={styles.txt}>Create New Account</Text>
        </View>
        <View style={styles.customInput}>
          <View style={styles.VInput}>
            <TextInput
              placeholder="Username"
              onChangeText={(text) => setUserName(text)}
              value={userName}
              onBlur={validateUsername}
            />
          </View>
          {usernameError && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.errorText}>{usernameError}</Text>
            </View>
          )}
          <View style={styles.VInput}>
            <TextInput
              placeholder="Email"
              onChangeText={(text) => setUserEmail(text)}
              value={userEmail}
              onBlur={validateEmail}
            />
          </View>

          {emailError && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.errorText}>{emailError}</Text>
            </View>
          )}
          <View style={styles.VInput}>
            <TextInput
              placeholder="Password"
              onChangeText={(text) => setUserPassword(text)}
              value={userPassword}
              secureTextEntry={true}
              onBlur={validatePassword}
            />
          </View>
          {passwordError && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          )}
          <View style={styles.VInput}>
            <TextInput
              placeholder="Confirm Password"
              onChangeText={(text) => setUserConfirm(text)}
              value={userConfirm}
              secureTextEntry={true}
              onBlur={validateConfirmPassword}
            />
          </View>
          {confirmPasswordError && (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            </View>
          )}
        </View>

        <View style={styles.button}>
          <CustomSignIn
            onPress={handlerRegister}
            text={"Register"}
            type={undefined}
            bgcolor={undefined}
            fgcolor={undefined}
          />

          <View style={styles.regTxtView}>
            <Text style={styles.regTxt}>
              By registering, you confirm that you accept our
              <Text style={styles.link} onPress={onRegisterPressed}>
                Terms of Use
              </Text>
              and
              <Text style={styles.link} onPress={onRegisterPressed}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          <CustomSignIn
            onPress={onRegisterPressed}
            text="Forgot password?"
            type="TERTIARY"
            bgcolor={undefined}
            fgcolor={undefined}
          />

          <CustomSignIn
            onPress={onRegisterPressed}
            text={"Sign In with Facebook"}
            type={undefined}
            bgcolor="#99CCFF"
            fgcolor="#4765A9"
          />

          <CustomSignIn
            onPress={onRegisterPressed}
            text="Sign In with Google"
            type={undefined}
            bgcolor="#FFCC99"
            fgcolor="#DD4D44"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <Text style={styles.text1}>Have account? </Text>
            <TouchableOpacity onPress={hanldeGoSignin}>
              <Text style={styles.text1}>Join us!!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  text1: {
    fontSize: 13,
    fontFamily: "Medium",
    color: colors.grey,
  },
  txtView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flex: 0.2,
    marginTop: "5%",
    //backgroundColor: colors.gold,
  },
  txt: {
    fontSize: 30,
    color: colors.lightAbitBlue,
    fontWeight: "bold",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  customInput: {
    flex: 0.25,
    //backgroundColor: colors.green,
  },
  button: {
    flex: 0.5,
    //backgroundColor: colors.brown,
  },
  regTxt: {
    fontSize: 13,
    color: colors.grey,
    marginVertical: 10,
  },
  link: {
    color: colors.brown,
  },
  regTxtView: {
    width: "90%",
    marginHorizontal: "5%",
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
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
  errorText: {
    fontSize: 15,
    color: colors.red,
  },
});
