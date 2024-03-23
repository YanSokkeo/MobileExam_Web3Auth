import AsyncStorage from "@react-native-async-storage/async-storage";
import PocketBase from "pocketbase";

// this 1 is host free
// const url = "https://steep-electrician.pockethost.io/";

//  this 2 server  host
// const url = 'https://others-pocketbase-quiz.jibofd.easypanel.host';

// this is host from bong maneat
const url = "https://quiz.panel.dreamslab.dev";
export const client = new PocketBase(url);
4;

// store user score to pocketbase
export async function createUserScore({
  name,
  username,
  quiz_id,
  point,
  user_result,
  user_id,
}: any) {
  const data = {
    name: name,
    username: username,
    quiz: quiz_id,
    score: point,
    result: user_result,
    user_id: user_id,
  };
  await client.collection("User_answer").create(data);
}

export async function updateUserScore({ quiz_id, point, user_result }: any) {
  const data = {
    quiz: quiz_id,
    score: point,
    result: user_result,
  };

  await client.collection("User_answer").update(quiz_id, data);
}

// Authentication

export async function signin({ email, password }: any) {
  const authRes = await client
    .collection("users")
    .authWithPassword(email, password);
  const user = await client.collection("users").getOne(authRes.record.id);
  await AsyncStorage.setItem("userData", JSON.stringify(user));
}

export async function signout() {
  client.authStore.clear();
  await AsyncStorage.clear();
}

export async function signUp({
  username,
  user_email,
  user_password,
  user_ConfirmPassword,
}: any) {
  const data = {
    username: username,
    email: user_email,
    emailVisibility: true,
    password: user_password,
    passwordConfirm: user_ConfirmPassword,
    name: username,
  };

  await client.collection("users").create(data);

  // (optional) send an email verification request
  // await client.collection("users").requestVerification(user_email);
}

export async function signIn(_data: any) {
  console.log(_data);
  const { email, username, profile } = _data;
  const password = "X#2p$8qZ";
  const _username = username.replace(/\s+/g, "").toLowerCase();
  const data = {
    username: _username,
    email: email,
    emailVisibility: true,
    password: password,
    passwordConfirm: password,
    name: username,
  };
  console.log(data);

  let user;
  try {
    user = await client
      .collection("users")
      .getFirstListItem(`email="${email}"`);
  } catch (err) {
    user = await client.collection("users").create(data);
  }
  console.log(user);
  await AsyncStorage.setItem("userData", JSON.stringify(user));

  const res = await client
    .collection("users")
    .authWithPassword(email, password);

  console.log("response", res);
  // (optional) send an email verification request
  // await client.collection("users").requestVerification(user_email);
}
