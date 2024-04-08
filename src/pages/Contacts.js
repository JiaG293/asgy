import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, SectionList, Image, TouchableOpacity } from 'react-native';
import SearchA from '../components/Search';
import { FlatList } from 'react-native';

export default function Contacts({ navigation }) {
  const { messages } = require('../data/mockChat');

  const [activeList, setActiveList] = useState('contacts');

  /* const groupsData = useMemo(() => {
    // Sẽ xử lý các groups dữ liệu tại đây...
    return []; // Trả về mảng các nhóm đã được xử lý
  }, [groups]);

  const renderGroupItem = ({ item }) => (
    // Xử lý sự kiện nhấn vào nhóm tại đây...
  ); */


  //nhom du lieu cung ten thanh 1 nhom
  const sectionsData = useMemo(() => {
    const groups = {};

    messages.forEach(message => {
      // Lấy chữ cái đầu của tên để làm key cho nhóm
      const groupName = message.sender[0].toUpperCase();
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(message);
    });

    return Object.keys(groups).sort().map(letter => ({
      title: letter,
      data: groups[letter].sort((a, b) => a.sender.localeCompare(b.sender))
    }));
  }, [messages]);

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
  // render contacts
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // Xử lý sự kiện nhấn vào liên hệ tại đây
        // Ví dụ: navigation.navigate('ChatScreen', { userId: item.id }); 
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{item.sender}</Text>
    </TouchableOpacity>
  );

  //render group
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem} onPress={() => {
      // Xử lý sự kiện nhấn vào nhóm
      // Ví dụ: navigation.navigate('GroupChatScreen', { groupId: item.id });
    }}>
      <Image source={{ uri: item.image }} style={styles.groupAvatar} />
      <Text style={styles.groupName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <SearchA />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }}
            title="Contacts"
            onPress={() => setActiveList('contacts')}  >
            <Text>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }}
            title="Groups"
            onPress={() => setActiveList('groups')} >
            <Text>Groups</Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeList === 'contacts' ? (
        <SectionList
          sections={sectionsData}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={item => item.id.toString()}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    backgroundColor: '#f7f7f7',
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
  },
  buttonsContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});
