import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { client } from "../api/Pocketbase";
import colors from "../../colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomNextPreview from "../components/button/CustomNextPreview";
import HeaderBackground from "../components/header/HeaderBackground";
import CustomAlert from "../components/modal/CustomAlert ";
import Icon from "react-native-vector-icons/Ionicons";
import ModalList from "../components/modal/ModalList";
import { useAtom } from "jotai";
import { CurrentQuestionIndexAtom } from "../atom/CurrentQuestionIndexAtom";
import { usePreventScreenCapture } from "expo-screen-capture";

interface QuestionModel {
  quiz_id: string;
  id: string;
  question: string;
  index_of_question: string;
  answers: string[];
  correct_answer: string;
}

interface AnswerModel {
  id: string;
  answer: string;
}

const Question = ({ route }: any) => {
  const navigation = useNavigation();
  const { id, time } = route.params;
  const [data, setData] = useState<Array<QuestionModel>>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Array<AnswerModel>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    CurrentQuestionIndexAtom
  );
  const totalQuestion = data.length;
  const [questionDuration, setQuestionDuration] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Array<
    Array<boolean>
  > | null>(null);
  const [point, setPoint] = useState(0);
  const progressPercentage = Math.floor(
    ((currentQuestionIndex + 1) / totalQuestion) * 100
  );
  const [oldChoice, setOldChoice] = useState<(string | null)[]>([]);

  const [counter, setCounter] = useState<number>(0);
  usePreventScreenCapture();
  let interval: any;
  let timer: any;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const questions: Array<QuestionModel> = await client
          .collection("Tbl_question")
          .getFullList();

        // Filter the questions based on quiz_id
        const filteredQuestions = questions.filter(
          (question) => question.quiz_id === id
        );

        setData(filteredQuestions);

        const answerIds = filteredQuestions.flatMap(
          (question) => question.answers
        );
        const fetchedAnswers: Array<AnswerModel> = await Promise.all(
          answerIds.map((answerId) =>
            client.collection("Tbl_answer").getOne(answerId)
          )
        );
        setAnswers(fetchedAnswers);

        // Initialize correctAnswers state
        const initialCorrectAnswers: Array<Array<boolean>> =
          filteredQuestions.map((question) => {
            const correctAnswerIds = question.correct_answer.split(",");
            return question.answers.map((answerId) =>
              correctAnswerIds.includes(answerId)
            );
          });
        setCorrectAnswers(initialCorrectAnswers);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const duration = time / totalQuestion;
    setQuestionDuration(duration);
  }, [data]);

  useEffect(() => {
    const backAction = () => {
      setShowAlert(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleConfirmLeave = () => {
    navigation.goBack();
    setShowAlert(false);
  };

  const handleCancelLeave = () => {
    setShowAlert(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearTimeout(timer);
      };
    }, [])
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const myInterval = () => {
      setCounter((prevCounter) => {
        if (prevCounter > 0) {
          return prevCounter - 1;
        }
        clearInterval(interval);
        handleNextQuestion();
        return questionDuration * 60; // Reset counter to questionDuration (converted to seconds)
      });
    };

    setCounter(questionDuration * 60); // Set counter to questionDuration in seconds when component mounts

    interval = setInterval(myInterval, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [questionDuration, currentQuestionIndex]);

  useEffect(() => {
    return () => {
      clearTimeout(interval);
    };
  }, [questionDuration]);

  let TotalQuestion = data.length;
  useEffect(() => {
    TotalQuestion = data.length;
  }, [data]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    const currentQuestion = data[currentQuestionIndex];
    const correctAnswer =
      correctAnswers && correctAnswers[currentQuestionIndex];

    if (currentQuestion && correctAnswer) {
      const answerIndex = currentQuestion.answers.findIndex(
        (item) => item.trim() === answer.trim()
      );
      const isAnswerTrue = correctAnswer[answerIndex];
      setIsAnswerCorrect(isAnswerTrue);
      console.log(`User's answer: ${answer}`);
      console.log(`Is answer correct? ${isAnswerTrue}`);
    }
  };

  const getAnswerText = (answerId: string) => {
    const answer = answers.find((ans) => ans.id === answerId);
    return answer ? answer.answer : "";
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === TotalQuestion - 1) {
      setTimeout(
        () =>
          navigation.navigate("result", {
            point: point + (isAnswerCorrect ? 10 : 0),
            answers: [...answers, isAnswerCorrect],
            quiz_id: id,
          }),
        0
      );
      return;
    }

    setCounter(questionDuration);

    const isNewAnswerCorrect = isAnswerCorrect;

    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = isNewAnswerCorrect;
      return updatedAnswers;
    });

    setOldChoice((prevOldChoice) => {
      const updatedOldChoice = [...prevOldChoice];
      updatedOldChoice[currentQuestionIndex + 1] = selectedAnswer;
      return updatedOldChoice;
    });

    setSelectedAnswer(null);
    setIsAnswerCorrect(false);

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    if (isNewAnswerCorrect) {
      setPoint((prevPoint) => prevPoint + 10);
    }
  };

  const handlePrevQuestion = () => {
    setCounter(questionDuration);

    const isPreviousChoiceCorrect = answers[currentQuestionIndex - 1];

    if (isPreviousChoiceCorrect) {
      setPoint((prevPoint) => prevPoint - 10);
    }

    setSelectedAnswer(oldChoice[currentQuestionIndex]);

    setIsAnswerCorrect(false);

    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const renderQuestion = () => {
    const { question, answers, correct_answer } = data[currentQuestionIndex];

    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === data.length - 1;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.questionText}>{question}</Text>
        {answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelection(answer)}
            style={{
              width: "95%",
              height: 80,
              backgroundColor:
                selectedAnswer === answer.trim() ? colors.blue : colors.white,
              padding: 20,
              margin: 10,
              flexDirection: "row",
              borderRadius: 10,
              alignSelf: "center",
            }}
          >
            <View style={styles.circle} />
            <Text
              style={{
                color:
                  selectedAnswer === answer.trim()
                    ? colors.white
                    : colors.deepBlue,
                fontSize: 14,
                paddingHorizontal: 10,
                flexWrap: "wrap",
                alignSelf: "center",
              }}
            >
              {getAnswerText(answer)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color={colors.deepBlue} />
      </View>
    );
  }

  if (data.length === 0 || !data[currentQuestionIndex]) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackground
        iconleft="menu"
        iconfirstRight="menu"
        title={`Question ${currentQuestionIndex + 1}/${totalQuestion}`}
        // title={'question'}
        textColor={colors.white}
        backgroundColors={colors.deepBlue}
        IconColor={colors.white}
        secondColor={colors.deepBlue}
      />
      <CustomAlert
        visible={showAlert}
        message="Are you sure? Do you want to leave?"
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
      <View style={styles.timer}>
        <Text
          style={{
            backgroundColor: colors.runTimeColor,
            width: `${progressPercentage}%`,
            height: 10,
          }}
        />
      </View>
      <View style={styles.timerWithList}>
        <View style={styles.iconContainer2}>
          <Icon
            name="chevron-back-outline"
            size={30}
            color={colors.backgroundWhite}
          />
        </View>
        <View style={styles.remainingContainer}>
          <Icon
            name="time-outline"
            size={30}
            style={{ color: colors.deepBlue }}
          />
          <Text style={styles.text}>{counter} Remaining</Text>
        </View>
        <ModalList questionData={data} />
      </View>

      <View style={styles.questionContainer}>
        {data.length > 0 && renderQuestion()}
      </View>

      <View style={styles.buttom_btn}>
        <CustomNextPreview
          text="Prev"
          iconLeft="chevron-left"
          leftColor={colors.white}
          onPress={handlePrevQuestion}
          disable={currentQuestionIndex >= 0}
          BackGround={colors.disableColor}
        />
        <CustomNextPreview
          text="Next"
          iconRight="chevron-right"
          rightColor={colors.white}
          onPress={handleNextQuestion}
          BackGround={colors.deepBlue}
        />
      </View>
    </SafeAreaView>
  );
};

export default Question;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    // paddingTop: Platform.OS === "android" ? 5 : 0,
  },
  itemContainer: {
    marginVertical: 10,
  },
  questionContainer: {
    flex: 0.8,
    margin: 10,
  },
  questionText: {
    fontSize: 20,
    color: colors.deepBlue,
    textAlign: "center",
  },
  answerText: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.deepBlue,
  },
  correctAnswerText: {
    fontWeight: "bold",
  },
  touchablestyle: {
    width: "95%",
    height: 80,
    backgroundColor: colors.white,
    padding: 20,
    margin: 10,
    flexDirection: "row",
    borderRadius: 10,
    alignSelf: "center",
  },

  circle: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightBlue,
    borderRadius: 20,
    alignSelf: "center",
  },
  buttom_btn: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  timer: {
    flex: 0.01,
    flexDirection: "row",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerWithList: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer2: {
    width: 32,
    height: 32,
    backgroundColor: colors.backgroundWhite,
    justifyContent: "center",
    alignItems: "center",
  },

  remainingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: colors.blue,
    fontFamily: "Medium",
    alignSelf: "center",
    padding: 10,
  },
});
