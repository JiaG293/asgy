import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import endpointAPI from "../api/endpointAPI";
import axios from "axios";
import statusCode from "../utils/statusCode";
import { setProfile, setUser } from "../redux/action";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  // const { handleLogin } = useLogin();
  const [usernameOrEmail, setUsernameOrEmail] = useState("bedauuu");
  const [password, setPassword] = useState("12344321");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const handleLogin = async (usernameOrEmail, password) => {
    try {
      console.log(endpointAPI.login);
      console.log(2);

      const response = await axios.post(endpointAPI.login, {
        userID: usernameOrEmail,
        password: password,
      });
      console.log(3);
      if (response.status === statusCode.OK) {
        const refreshToken = response.data.metadata.tokens.refreshToken;
        const clientId = response.data.metadata.clientId;
        const profile = response.data.metadata.profile;
        const user = response.data.metadata.user;
        console.log("Đăng nhập thành công");
        dispatch(setProfile(profile));
        dispatch(setUser(user));
        
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("clientId", clientId);

        navigation.navigate("home");
      } else {
        console.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const clientId = await AsyncStorage.getItem("clientId");
      if (refreshToken && clientId) {
        navigation.navigate("home");
      }
    };
  
    checkLoggedIn();
  }, []);

  return (
    <View style={styles.contaiter}>
      <View style={styles.header}>
        <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </Pressable>
        <Text style={styles.text1}> Đăng nhập </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.wraptext2}>
          <Text style={styles.text2}>
            Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
          </Text>
        </View>
        <TextInput
          style={styles.input1}
          placeholder="Số điện thoại"
          placeholderTextColor="#666"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
        />
        <TextInput
          style={styles.input2}
          placeholder="Mật khẩu"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Text style={styles.textFailLogin}>{message}</Text>
        <Pressable onPress={() => navigation.navigate("LayLaiMatKhau")}>
          <Text style={styles.text3}>Lấy lại mật khẩu </Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.wrapicon}
        onPress={() => {
          handleLogin(usernameOrEmail, password);
        }}
      >
        <AntDesign name="arrowright" size={20} color="#000" />
      </Pressable>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  contaiter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    width: "100%",
    overflow: "hidden",
  },
  header: {
    width: "100%",
  },
  header2: {},
  btn: {
    zIndex: 1,
    position: "absolute",
    left: 16,
    top: 52,
  },
  icon: {
    width: 22,
    height: 30,
  },
  text1: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
    width: "100%",
    height: 22,
    zIndex: 1,
    top: 54,
    left: 50,
  },
  wraptext2: {
    backgroundColor: "#F3F4F6",
    width: "100%",
    position: "absolute",
    height: 43,
    left: 0,
    top: -28,
    justifyContent: "center",
    paddingLeft: 20,
  },
  text2: {},
  text3: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1aff1a",
    textAlign: "left",
    width: 157,
    height: 33,
    paddingTop: 10,
  },

  input1: {
    width: "100%",
    height: 40,
    // outlineStyle: "none",
    marginBottom: 8,
    borderBottomColor: "#dfdfdf",
    borderBottomWidth: 2,
    marginTop: 40,
  },
  input2: {
    width: "100%",
    height: 40,
    borderBottomColor: "#23D1F4",
    borderBottomWidth: 2,
    // outlineStyle: "none",
    marginBottom: 8,
  },
  body: {
    marginTop: 95,
    width: "100%",
    paddingHorizontal: 16,
  },
  icon2: {
    width: 22,
    height: 30,
  },
  wrapicon: {
    zIndex: 1,
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    backgroundColor: "#1aff1a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  textFailLogin: {
    color: "red",
    fontSize: 12,
  },
});
