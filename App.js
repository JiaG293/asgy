import { StyleSheet, View } from 'react-native';
import FlashScreen from './src/pages/FlashScreen';
import SearchA from './src/components/Search';
import Chat from './src/pages/Chat';
import Test from './src/pages/Test';

export default function Search() {
  return (
    <View style={styles.container}>
      {/* <FlashScreen/> */}
      {/* <SearchA/> */}
      {/* <Chat/> */}
      <Test/>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
