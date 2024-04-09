import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import SearchA from '../components/Search';

import socketIOClient from 'socket.io-client';
import callAPI from '../api/callAPI';
import endpointAPI from '../api/endpointAPI';
import { setProfile } from '../redux/action';
import {useDispatch} from 'react-redux';


export default function Chat({ navigation }) {
    const dispatch = useDispatch();

    const { messages } = require('../data/mockChat');
    // const [messages, setMessages] = useState([]);

    /* useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/chats/channels');
                setMessages(response.data); // giả sử response.data là một mảng các tin nhắn
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        
        socket.on('newMessage', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => socket.disconnect(); // Clean up khi component unmount
    }, []); */


    const fetchData = async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const clientID = localStorage.getItem("clientId");
          if (!refreshToken) {
            console.error("refreshToken không tồn tại");
            return;
          }
          const headers = {
            "x-client-id": clientID,
            "authorization": refreshToken,
          };
    
          const response = await axios.get(endpointAPI.getInfoProfile, {
            headers,
          });
    
          if (response.status === 200) {
            const profile = response.data.metadata;
            dispatch(setProfile(profile));
          } else {
            console.error("Lỗi khi lấy thông tin người dùng");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };
    
      useLayoutEffect(() => {
        fetchData();
      }, []);


    const renderMessageItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.messageItem}
                onPress={() => {
                    navigation.navigate("ChatScreen", {
                        avatar: item.avatar,
                        sender: item.sender,
                        messages: item.messages,
                    });
                }}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.messageContent}>
                    <View style={styles.messageText}>
                        <Text numberOfLines={1} style={styles.sender}>{item.sender}</Text>
                        <Text>{item.content}</Text>
                    </View>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View>
                <SearchA />
            </View>
            <FlatList
                style={{ flex: 1 }}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessageItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    messageItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    messageContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
    },
    messageText: {
        flex: 1,
    },
    sender: {
        fontWeight: 'bold',
    },
    time: {
        alignSelf: 'center',
        color: '#999',
    },
});
