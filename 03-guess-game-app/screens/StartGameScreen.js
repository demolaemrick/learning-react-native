import { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Alert } from 'react-native';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import Title from '../components/ui/Title';
import InstructionText from '../components/ui/InstructionText';

import Colors from '../constants/colors';

function StartGameScreen({ onPickNumber }) {
  const [enteredNumber, setEnteredNumber] = useState('');
  function numberInputHandler(enteredText) {
    setEnteredNumber(enteredText);
  }

  function resetInputHandler() {
    setEnteredNumber('');
  }
  function confirmInputHandler() {
    const chosenNumber = parseInt(enteredNumber);
    if (Number.isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
      // show alert ...
      Alert.alert(
        'Invalid number!',
        'Number has to be a number between 1 and 99.',
        [{ text: 'Okay', style: 'destructive', onPress: resetInputHandler }]
      );
      return;
    }
    onPickNumber(chosenNumber);
  }
  return (
    <View style={styles.rootContainer}>
      <Title>Guess My Number</Title>
      <Card>
        <InstructionText>Enter a number</InstructionText>
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
            <PrimaryButton onPress={resetInputHandler}>Reset</PrimaryButton>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={confirmInputHandler}>Confirm</PrimaryButton>
          </View>
        </View>
      </Card>
    </View>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center'
  },

  numberInput: {
    height: 50,
    width: 50,
    fontSize: 32,
    borderBottomColor: Colors.accent500,
    borderBottomWidth: 2,
    color: Colors.accent500,
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  /* to ensure that each flex element takes its available space */
  buttonContainer: {
    flex: 1,
  },
});
