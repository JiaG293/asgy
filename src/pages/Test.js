import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Chat from './Chat';
import Contacts from './Contacts';
import Information from './Information';

const Tab = createBottomTabNavigator();

export default function Test() {
    return (
        <NavigationContainer>
            <Tab.Navigator 
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Chat') {
                            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                        } else if (route.name === 'Danh ba') {
                            iconName = focused ? 'people' : 'people-outline';
                        } else if (route.name === 'Ca nhan') {
                            iconName = focused ? 'information-circle' : 'information-circle-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    headerShown: false,
                })
                
            }
                tabBarOptions={{
                    activeTintColor: '#ccc',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Chat" component={Chat} options={{ tabBarBadge: 3 }}/>
                <Tab.Screen name="Danh ba" component={Contacts} />
                <Tab.Screen name="Ca nhan" component={Information} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}