import { StyleSheet, View } from 'react-native';
import { Provider } from "react-redux";
import store from './src/redux/store';

import Root from './src/router/Root';
import ChatScreen from './src/pages/ChatScreen';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Root/>
        {/* <ChatScreen/> */}
      </View>
    </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});