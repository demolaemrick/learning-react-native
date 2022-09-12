import { TextInput, View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

function StartGameScreen() {
  return (
    <View style={styles.inputContainer}>
      <TextInput />
      <PrimaryButton>Reset</PrimaryButton>
      <PrimaryButton>Confirm</PrimaryButton>
    </View>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 100,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: "#720636",
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
});
