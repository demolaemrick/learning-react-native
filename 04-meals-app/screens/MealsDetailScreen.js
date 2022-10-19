import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import MealDetails from '../components/MealDetails';

import { MEALS } from '../data/dummy-data';

const MealsDetailScreen = () => {
  const route = useRoute();
  const mealId = route.params.mealId;

  const selectedMeal = MEALS.find((meal) => meal.id === mealId);

  return (
    <View>
      <Image source={{ uri: selectedMeal.imageUrl }} />
      <Text>{selectedMeal.title}</Text>
      <MealDetails
        duration={selectedMeal.duration}
        complexity={selectedMeal.complexity}
        affordability={selectedMeal.affordability}
      />
      <Text>Ingredients</Text>
      {selectedMeal.ingredients.map((ingredient) => (
        <Text key={ingredient}>{ingredient}</Text>
      ))}
      <Text>Steps</Text>
      {selectedMeal.steps.map((step) => (
        <Text key={step}>{step}</Text>
      ))}
    </View>
  );
};

export default MealsDetailScreen;

const styles = StyleSheet.create({});
