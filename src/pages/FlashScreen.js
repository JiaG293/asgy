import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function FlashScreen({ navigation }) {
    const showImage = () => {
        setTimeout(() => {
            navigation.navigate('auth')
        }, 2000);
    }
    /* const translateY = useRef(new Animated.Value(-1500)).current;

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: 0,
            tension: 2,
            friction: 4,
            useNativeDriver: true,
        }).start();
    }, []); */

    const transt = useRef(new Animated.Value(-200)).current;
    useEffect(() => {
        Animated.timing(transt, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [transt]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../../assets/logo.png")}
                style={{
                    marginTop: transt,
                    width: 150,
                    height: 150
                }/* [
                    styles.logo,
                     {
                        transform: [
                            { translateY }
                        ]
                    } 
                ] */}
            />
            {showImage()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {

    },
});
