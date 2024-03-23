import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import colors from "../../../colors";
import { client } from "../../api/Pocketbase";
import { useAtom } from "jotai";
import { SearchQuery } from "../../atom/SearchQuery";

interface Props {
  iconName?: string;
  error?: string;
  password?: string | number;
  placeholder: string;

  headIcon?: string;
  onChangeText?: (value: any) => void;
  onSubmitEditing?: (value: any) => void;
}

const SearchBox: React.FC<Props> = (props) => {

  const [searchQuery, setSearchQuery] = useAtom(SearchQuery);

  const handleSearchQueryChange = (text: React.SetStateAction<string>) => {
    setSearchQuery(text);
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
    >
      <View style={styles.container2}>
        <Icon name={props.iconName ?? ""} size={30} style={styles.icon} />
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={colors.lightGrey}
          style={styles.Textput}
          value={searchQuery}
          onChangeText={handleSearchQueryChange}
          onSubmitEditing={props.onSubmitEditing}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    margin: 15,
  },
  icon: {
    color: colors.deepBlue,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  container2: {
    height: 68,
    backgroundColor: colors.white,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    fontFamily: "bold",
    color: colors.deepBlue,
  },

  Textput: {
    width: "85%",
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 14,
    color: colors.deepBlue,
    // placeholderTextColor: defaultColor.Smoke,
  },
});