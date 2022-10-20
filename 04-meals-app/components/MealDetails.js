import { View, Text, StyleSheet } from 'react-native';

const MealDetails = ({ duration, complexity, affordability, textStyle }) => {
  const textStyles = [styles.detailsItem, textStyle];
  return (
    <View style={styles.details}>
      <Text style={textStyles}>{duration}m</Text>
      <Text style={textStyles}>{complexity.toUpperCase()}</Text>
      <Text style={textStyles}>{affordability.toUpperCase()}</Text>
    </View>
  );
};
export default MealDetails;

const styles = StyleSheet.create({
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  detailsItem: {
    marginHorizontal: 4,
  },
});
