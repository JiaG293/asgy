import { useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { setProfile, setUser } from "../redux/action";
import callAPI from "../api/callAPI";
import statusCode from "../utils/statusCode";
import { useDispatch } from "react-redux";
import { useNavigation } from '@react-navigation/native';

const useLogin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  // Hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  // Đăng nhập thành công
  const handleLoginSuccess = async (res) => {
    const { refreshToken, profile, user } = res.metadata.tokens;
    const clientId = res.metadata.clientId;
    dispatch(setProfile(profile));
    dispatch(setUser(user));

    // dung local web
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('clientId',clientId)


    // dung storage app
    /* await SecureStore.setItemAsync('secure_token', refreshToken);
    const a = await SecureStore.getItemAsync('secure_token');
    console.log(a); */


    navigation.navigate('home');
  };

  // Đăng nhập thất bại
  const handleLoginFailure = () => {
    // Xử lý khi đăng nhập thất bại
  };

  // Xử lý lỗi khi đăng nhập
  const handleLoginError = (error) => {
    console.log(error);
  };

  // Xử lý đăng nhập
  const handleLogin = async (usernameOrEmail, password) => {
    try {
      const response = await callAPI.login(usernameOrEmail, password);
      if (response.status === statusCode.OK) {
        handleLoginSuccess(response);
      } else {
        handleLoginFailure();
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  return { visible, togglePasswordVisibility, handleLogin };
};

export default useLogin;
