import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashScreen from "../pages/FlashScreen";
import AuthSelection from "../pages/AuthSelection";
import Login from "../pages/Login";
import ButtonTab from "../pages/ButtonTab";




const Stack = createNativeStackNavigator();
export default function Root() {

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={FlashScreen}></Stack.Screen>
          <Stack.Screen name="auth" component={AuthSelection}></Stack.Screen>
          <Stack.Screen name="login" component={Login}></Stack.Screen>
          <Stack.Screen name="home" component={ButtonTab}></Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    );
};