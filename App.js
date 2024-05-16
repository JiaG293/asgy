import { StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from "react-redux";
import store from './src/redux/store';

import Root from './src/router/Root';

export default function App() {
  return (
    <Provider store={store}>
      {/* <StatusBar> */}
        <View style={styles.container}>
          <StatusBar/>
          <Root />
        </View>
      {/* </StatusBar> */}
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