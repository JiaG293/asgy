import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
const AuthSelection = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ASGY</Text>
            <Image style={styles.bgr1} />
            <Image style={styles.bgr2} />
            <Text style={styles.text1}>Nơi những dòng tin nhắn giản đơn </Text>
            <Text style={styles.text2}>trở thành những khoảnh khắc đặc biệt</Text>
            <Image style={styles.icon} />
            <Pressable style={styles.btn1} onPress={() => navigation.navigate('login')}>
                <Text style={styles.btntext1}>ĐĂNG NHẬP </Text>
            </Pressable>
            <Pressable style={styles.btn2} onPress={() => navigation.navigate('register')}>
                <Text style={styles.btntext2}>ĐĂNG KÝ </Text>
            </Pressable>

            <View style={styles.bottom}>
                <Text style={[styles.bottomtext, styles.bottomtextactive]}>Tiếng Việt </Text>
                <Text style={styles.bottomtext}>English </Text>
            </View>
        </View>
    )
}

export default AuthSelection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width: '100%',
        overflow: 'hidden'
    },
    title: {
        fontSize: 38,
        fontWeight: "600",
        color: "#1aff1a",
        textAlign: "left",
        paddingTop: 64,
    },
    bgr1: {
        width: '100%',
        height: 250,
        resizeMode: 'contain'
    },
    bgr2: {
        width: '100%',
        height: 140,
        resizeMode: 'contain',
        position: 'absolute',
        top: 200,
    },
    text1: {
        fontSize: 16,
        letterSpacing: -0.3,
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
        // width: 138,
        height: 21
    },
    text2: {
        fontSize: 14,
        letterSpacing: -0.1,
        fontWeight: "500",
        color: "#000",
        textAlign: "center",
        width: 407,
        height: 33,
        opacity: 0.6,
        paddingHorizontal: 40,
    },
    icon: {
        width: "100%",
        height: 9,
        resizeMode: 'contain',
        marginBottom: 40,
        marginTop: 20,
    },
    btn1: {
        borderRadius: 25,
        backgroundColor: "#1aff1a",
        width: 238,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    btntext1: {
        fontSize: 15,
        letterSpacing: -0.4,
        fontWeight: "500",
        color: "#fff",
        textAlign: "center",
        width: 92,
        height: 16
    },
    btn2: {
        borderRadius: 25,
        backgroundColor: "#f2f4f7",
        width: 238,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    btntext2: {
        fontSize: 15,
        letterSpacing: -0.4,
        fontWeight: "500",
        color: "#000",
        textAlign: "center",
        width: 92,
        height: 16
    },
    bottom: {
        flexDirection: 'row',
        position: 'fixed',
        bottom: 10,
    },
    bottomtextactive: {
        textDecorationLine: 'underline',
        fontWeight: "500",
    },
    bottomtext: {
        fontSize: 15,
        letterSpacing: -0.6,
        paddingHorizontal: 7,
    },

})