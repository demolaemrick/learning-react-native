import { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

function StartGameScreen() {
    const [enteredNumber, setEnteredNumber] = useState("");
    
    function numberInputHandler(enteredText) {
        setEnteredNumber(enteredText);
    }

    function confirmInputHandler() {
        
    }
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.numberInput}
        maxLength={2}
        keyboardType="number-pad"
        autoCapitalize="none"
        onChangeText={numberInputHandler}
        autoCorrect={false}
        value={enteredNumber}
      />
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <PrimaryButton>Reset</PrimaryButton>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={confirmInputHandler}>Confirm</PrimaryButton>
        </View>
      </View>
    </View>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    marginTop: 100,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: "#3b021f",
    borderRadius: 8,
    /* this only adds shadow to android */
    elevation: 4,
    /* adding shadow to ios */
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    /* controls how much the shadow expands on ios */
    shadowRadius: 6,
    /* the shadow's thickness on ios */
    shadowOpacity: 0.25,
  },
  numberInput: {
    height: 50,
    width: 50,
    fontSize: 32,
    borderBottomColor: "#ddb52f",
    borderBottomWidth: 2,
    color: "#ddb52f",
    marginVertical: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  /* to ensure that each flex element takes its available space */
  buttonContainer: {
    flex: 1,
  },
});
