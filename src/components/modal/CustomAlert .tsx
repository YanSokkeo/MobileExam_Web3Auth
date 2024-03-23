import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../../colors";

const CustomAlert = ({ visible, message, onConfirm, onCancel }: any) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  message: {
    fontFamily: "bold",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: colors.red,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.deepBlue,
    marginHorizontal: 8,
  },
  buttonText: {
    fontFamily: "bold",
    fontSize: 16,
    color: "#fff",
  },
});

export default CustomAlert;
