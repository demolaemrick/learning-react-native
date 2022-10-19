import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const MealItem = ({
  id,
  title,
  imageUrl,
  duration,
  complexity,
  affordability,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.menuItem}>
      <Pressable
        android_ripple={{ color: '#ccc' }}
        style={({ pressed }) => (pressed ? styles.buttonPressed : null)}
        onPress={() => navigation.navigate('MealsDetail', { mealId: id })}
      >
        {/* the essence of this wrapper is to be able to add border radius to the card that was removed due to the shadow added to ios */}
        <View style={styles.innerContainer}>
          <View>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.detailsItem}>{duration}m</Text>
            <Text style={styles.detailsItem}>{complexity.toUpperCase()}</Text>
            <Text style={styles.detailsItem}>
              {affordability.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default MealItem;

const styles = StyleSheet.create({
  menuItem: {
    margin: 16,
    borderRadius: 8,
    overflow:
      Platform.OS === 'android'
        ? 'hidden'
        : 'visible' /* Note: this removes the border top radius from the card  */,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  innerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    margin: 8,
  },
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
