import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import SearchA from "../components/Search";
import { useSelector } from "react-redux";

export default function Contacts({ navigation }) {
  const friendList = useSelector((state) => state.friendsList);
  console.log(friendList);

  const [activeList, setActiveList] = useState("contacts");

  // Render contacts
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // Xử lý sự kiện nhấn vào liên hệ tại đây
        // Ví dụ: navigation.navigate('ChatScreen', { userId: item.id });
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchA />
      {/* Hiển thị FlatList ở dưới */}
      <FlatList
        data={friendList}
        renderItem={renderItem}
        keyExtractor={(item) => item.profileIdFriend}
        style={{marginTop:40}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#555555",
  },
  buttonsContainer: {
    marginTop: 45,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  button: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
