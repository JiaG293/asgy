import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function FlashScreen() { 
    const translateY = useRef(new Animated.Value(-1500)).current;

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: 0,
            tension: 2,
            friction: 4,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image 
                source={require("../../assets/logo.png")}
                style={[
                    styles.logo,
                    {
                        transform: [
                            { translateY }
                        ]
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150
    },
});
