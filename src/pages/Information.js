import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function Profile() {
  const profile = useSelector(state => state.profile);
  const channelList = useSelector((state) => state.channelList);


  // Dữ liệu mẫu, thay đổi theo thông tin thực tế
  const userInfo = {
    avatar: 'https://www.facebook.com/photo/?fbid=802635638258369&set=a.105716497950290',
    name: 'Hoang Anh',
    tieuSu: 'dau be ba',
  };

  // Các tùy chọn trong phần Profile
  const options = [
    { title: 'Nhật ký Zalo', icon: require('../../assets/icon.png') },
    { title: 'Tin của bạn', icon: require('../../assets/logo.png') },
    // Thêm các tùy chọn khác theo cấu trúc trên...
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={{uri: profile?.avatar} } style={styles.avatar} />
          <Text style={styles.name}>{profile?.fullName}</Text>
          <Text style={styles.phoneNumber}>{userInfo.tieuSu}</Text>
        </View>

        {options.map((option, index) => (
          <TouchableOpacity key={index} style={styles.optionItem}>
            <Image source={option.icon} style={styles.optionIcon} />
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tieuSu: {
    fontSize:20,
    color: 'gray',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 20,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    fontSize: 18,
  },
});
