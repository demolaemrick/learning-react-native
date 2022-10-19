import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const MealsDetailScreen = () => {
  const route = useRoute();
  const mealId = route.params.mealId;
  return (
    <View>
      <Text>MealsDetailsScreen - {mealId}</Text>
    </View>
  );
};

export default MealsDetailScreen;

const styles = StyleSheet.create({});
