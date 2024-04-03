import { StyleSheet, View } from 'react-native';
import SearchA from '../components/Search';
export default function Information() {
  return (
    <View style={styles.container}>
        <SearchA/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
