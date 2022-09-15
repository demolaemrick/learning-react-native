import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginTop: 36,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: Colors.primary800,
    borderRadius: 8,
    /* this only adds shadow to android */
    elevation: 4,
    /* adding shadow to ios */
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    /* controls how much the shadow expands on ios */
    shadowRadius: 6,
    /* the shadow's thickness on ios */
    shadowOpacity: 0.25,
  },
});
