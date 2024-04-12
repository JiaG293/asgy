import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen({ route, navigation }) {
    const { avatar, sender, message } = route.params; // Lấy thông tin avatar và tên từ props route

    const [space, setSpace] = useState('');
    const [isInputEmpty, setIsInputEmpty] = useState(true); // State để xác định ô nhập tin nhắn có rỗng hay không

    const handleMessageSend = () => {
        // Xử lý gửi tin nhắn
        console.log('Sending message:', space);
        // Code gửi tin nhắn tới máy chủ hoặc xử lý dữ liệu ở đây
        // Sau đó, bạn có thể cập nhật danh sách tin nhắn hoặc thực hiện các tác vụ khác
        setSpace(''); // Xóa nội dung tin nhắn sau khi gửi
        setIsInputEmpty(true); // Đặt trạng thái ô nhập tin nhắn về rỗng
    };

    // ham xu ly nut enter
    const handleSendMessageOnEnter = () => {
        if (!isInputEmpty) {
            handleMessageSend();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'< '}</Text>
                </TouchableOpacity>
                <View style={styles.userInfo}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.senderName}>{sender}</Text>
                </View>
            </View>


            <View style={styles.chatContainer}>
                <FlatList
                    style={styles.chatContainer}
                    data={message}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.message}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.messageContent}>
                                <Text style={styles.sender}>{item.sender}</Text>
                                <Text>{item.content}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.emojiButton}>
                    <MaterialCommunityIcons name="emoticon" size={20} color="#000" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={space}
                    onSubmitEditing={handleSendMessageOnEnter}
                    onChangeText={text => {
                        setSpace(text);
                        setIsInputEmpty(text.trim().length === 0);
                    }}
                    
                />
                {!isInputEmpty && (
                    <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend}>
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    backButton: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    senderName: {
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
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
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    iconButton: {
        paddingHorizontal: 10,
    },
});
