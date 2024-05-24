import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket/socket";
import { setCurrentMessages, setMessages } from "../redux/action";

export default function ChatScreen({ navigation }) {
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const currentChannel = useSelector((state) => state.currentChannel);
  const currentMessages = useSelector((state) => state.currentMessages);
  const messagesList = useSelector((state) => state.messagesList);

  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;

  // ham xu ly nut enter
  const handleSendMessageOnEnter = () => {
    if (!isInputEmpty) {
      handleMessageSend(inputValue);
    }
  };

  const handleMessageSend = (value) => {
    // Kiểm tra xem đã có đủ thông tin để gửi tin nhắn chưa
    if (profile && currentChannel && value) {
      socket.emit("sendMessage", {
        senderId: profile._id,
        receiverId: currentChannel._id,
        typeContent: "TEXT_MESSAGE",
        messageContent: value,
      });
      // dispatch(setCurrentMessages());
      setInputValue("");
    }
  };

  console.table(currentMessages);

  useEffect(() => {
    socket.on("getMessage", (newMessage) => {
      const message = {
        channelId: currentChannel,
        messages: newMessage,
      };
      dispatch(setMessages([...messagesList, message]));
      dispatch(setCurrentMessages([...currentMessages, newMessage]));
    });
  }, [currentMessages]);

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
  data={currentMessages}
  renderItem={({ item }) => (
    <View style={item.senderId === profileID ? styles.rightMessageContainer : styles.leftMessageContainer}>
      {item.senderId !== profileID && (
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar1}
        />
      )}
      <View style={item.senderId === profileID ? styles.rightMessage : styles.leftMessage}>
        {item.typeContent === "IMAGE_FILE" ? (
          <Image
            source={{ uri: item.messageContent }}
            style={styles.imageMessage}
          />
        ) : item.typeContent === "DOCUMENT_FILE" ? (
          <Text style={styles.documentLink} onPress={() => handleDocumentPress(item.messageContent)}>View Document</Text>
        ) : (
          <Text style={styles.messageText}>{item.messageContent}</Text>
        )}
      </View>
    </View>
  )}
  keyExtractor={(item) => item._id}
  contentContainerStyle={styles.chatContainer}
/>


      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.emojiButton}>
          <MaterialCommunityIcons name="emoticon" size={20} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
            setIsInputEmpty(text.trim().length === 0);
          }}
        />
        {!isInputEmpty && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessageOnEnter}
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
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
  rightMessageContainer: {
    flexDirection: "row-reverse",
    marginBottom: 10,
    marginRight: 10,
    alignSelf: "flex-end",
  },
  avatarWrapper: {
    marginRight: 5,
  },
  leftMessage: {
    backgroundColor: "#e1ffc7",
    padding: 10,
    borderRadius: 10,
    maxWidth: 250,
  },
  rightMessage: {
    backgroundColor: "#c7e1ff",
    padding: 10,
    borderRadius: 10,
    maxWidth: 250,
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

  imageMessage: {
    width: 200, // hoặc bất kỳ giá trị nào phù hợp
    height: 200, // hoặc bất kỳ giá trị nào phù hợp
    borderRadius: 10,
  },

  documentLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  
});
