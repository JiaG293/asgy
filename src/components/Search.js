import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchA() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = ()=>{
    return ;
  };
  /* async () => {
    try {
      // Kiểm tra xem có dữ liệu tìm kiếm không
      if (searchQuery.trim() === '') {
        Alert.alert('Thông báo', 'Vui lòng nhập từ khóa tìm kiếm!');
        return;
      }

      // Gửi request tới máy chủ để thực hiện tìm kiếm
      const response = await fetch(`http://yourapi.com/search?query=${searchQuery}`);
      const data = await response.json();

      // Xử lý kết quả trả về từ máy chủ
      console.log('Kết quả tìm kiếm:', data);
      
      // Đặt lại ô tìm kiếm thành trống sau khi tìm kiếm thành công
      setSearchQuery('');
    } catch (error) {
      console.error('Lỗi khi thực hiện tìm kiếm:', error);
    }
  }; */

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#000" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          // returnKeyType="search"   thay type enter = search tren ban phim
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 50,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
});
