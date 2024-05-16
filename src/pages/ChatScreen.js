import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

export default function ChatScreen({ navigation }) {
  const [space, setSpace] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const currentChannel = useSelector((state) => state.currentChannel);
  const currentMessages = useSelector((state) => state.currentMessages);

  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;

  const handleMessageSend = () => {
    // Xử lý gửi tin nhắn
    console.log("Sending message:", space);
    setSpace("");
    setIsInputEmpty(true);
  };

  // ham xu ly nut enter
  const handleSendMessageOnEnter = () => {
    if (!isInputEmpty) {
      handleMessageSend();
    }
  };

  console.table(currentMessages[0]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"< "}</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {currentChannel.typeChannel == 101 ? (
            <Image
              source={{ uri: currentChannel?.icon }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={{ uri: currentChannel?.iconGroup }}
              style={styles.avatar}
            />
          )}
          <Text style={styles.senderName}>{currentChannel?.name}</Text>
        </View>
      </View>

      <FlatList
        data={currentMessages/* .slice().reverse() */}
        renderItem={({ item }) => (
          <View style={item.senderId === profileID ? styles.rightMessageContainer : styles.leftMessageContainer}>
            {item.senderId !== profileID && (
              <Image
                source={{ uri: item.avatar }}
                style={styles.avatar1}
              />
            )}
            <View style={item.senderId === profileID ? styles.rightMessage : styles.leftMessage}>
              <Text style={styles.messageText}>{item.messageContent}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.chatContainer}
        // inverted
      />


      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton}>
          <MaterialCommunityIcons name="emoticon" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={space}
          onSubmitEditing={handleSendMessageOnEnter}
          onChangeText={(text) => {
            setSpace(text);
            setIsInputEmpty(text.trim().length === 0);
          }}
        />
        {!isInputEmpty && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleMessageSend}
          >
            <Ionicons name="send-sharp" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  backButton: {
    fontWeight: "bold",
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  senderName: {
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  // sendButton: {
  //     backgroundColor: '#007BFF',
  //     borderRadius: 20,
  //     paddingVertical: 10,
  //     paddingHorizontal: 20,
  // },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  leftMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10, 
    alignSelf: "flex-start", 
    flexWrap: "wrap",
  },
  rightMessageContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10, 
    alignSelf: "flex-end",
    flexWrap: "wrap",
  },
  leftMessage: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
  },
  rightMessage: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
  },
  avatar1: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  messageText: {
    color: "#000",
  },
});
