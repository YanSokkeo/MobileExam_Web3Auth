import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../../../colors";
import Quiz from "../dummy/Quiz";
import { client } from "../../api/Pocketbase";
import { useAtom } from "jotai";
import { CurrentQuestionIndexAtom } from "../../atom/CurrentQuestionIndexAtom";

const data = Quiz;
interface RecordModel {
  isAnswers: any;
  id: number;
  question: string;
  answers: string;
  index_of_question: number;
}
interface QuestionModel {
  quiz_id: string;
  id: string;
  question: string;
  index_of_question: string;
  answers: string[];
  correct_answer: string;
}

const ModalPopup = ({ visible, children }: any) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer]}>{children}</View>
      </View>
    </Modal>
  );
};

const ModalList = ({
  questionData,
}: {
  questionData: Array<QuestionModel>;
}) => {
  const [visible, setVisible] = React.useState(false);
  const [numberData, setNumberData] = useState<Array<RecordModel>>([]);
  const [data, setData] = useState<Array<QuestionModel>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    CurrentQuestionIndexAtom
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records: Array<RecordModel> = await client
          .collection("completed")
          .getFullList();
        setNumberData(records);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const controlView = questionData.map((question, data) => (
    <View
      key={question.id}
      style={[
        styles.controll_box,
        // Apply a different style to the current question index
        currentQuestionIndex + 1 <= data && styles.currentQuestionIndex,
      ]}
    >
      <Text
        style={[
          styles.text,
          currentQuestionIndex + 1 <= data && styles.textIndex,
        ]}
      >
        {question.index_of_question}
      </Text>
    </View>
  ));

  return (
    <View style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}>
      <ModalPopup visible={visible}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.head}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon
                name="chevron-back-outline"
                size={30}
                color={colors.deepBlue}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.controll}>{controlView}</View>
        </View>
      </ModalPopup>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setVisible(true)}
      >
        <Icon name="chevron-back-outline" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ModalList;

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "60%",
    backgroundColor: colors.backgroundWhite,
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 25,
    elevation: 25,
  },
  head: {
    width: "100%",
    height: 40,
    alignItems: "flex-start",
  },
  controll: {
    width: "100%",
    height: "90%",
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  controll_box: {
    width: 44,
    height: 44,
    backgroundColor: colors.lightAbitBlue,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    alignContent: "center",
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
    paddingTop: 10,
    fontSize: 16,
    color: colors.white,
    fontFamily: "Medium",
  },
  textIndex: {
    alignSelf: "center",
    paddingTop: 10,
    fontSize: 16,
    color: colors.deepBlue,
    fontFamily: "Medium",
  },
  currentQuestionIndex: {
    backgroundColor: colors.white,
  },
});