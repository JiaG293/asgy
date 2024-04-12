import React, { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import SearchA from '../components/Search';

import socketIOClient from 'socket.io-client';
import callAPI from '../api/callAPI';
import endpointAPI from '../api/endpointAPI';
import { setChannels, setProfile } from '../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { clientId, refreshToken } from '../auth/trans';


export default function Chat({ navigation }) {
    const profile = useSelector((state) => state.profile);
    const profileID = profile?._id;
    const channelList = useSelector((state) => state.channelList);
    const dispatch = useDispatch();

    // const { messages } = require('../data/mockChat');

    const fetchDataProfile = async () => {
        try {
           
            if (!refreshToken) {
                console.error("refreshToken không tồn tại");
                return;
            }
            const headers = {
                "x-client-id": clientId,
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
    const fetchDataChannel = async () => {
        try {
            if (!refreshToken) {
                console.error("refreshToken không tồn tại");
                return;
            }
            const headers = {
                "x-client-id": clientId,
                authorization: refreshToken,
            };
            const response = await axios.get(
                "http://localhost:5000/api/v1/chats/channels",
                {
                    headers,
                }
            );
            if (response.status === 200) {
                const channelList = response.data.metadata;
                dispatch(setChannels(channelList));
                // setChannelLoaded(true);
                console.log(channelList);
            } else {
                console.error("Lỗi khi lấy thông tin người dùng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
    };

    useLayoutEffect(() => {
        fetchDataProfile();
        fetchDataChannel();
    }, []);

      const rendermessit = ({item})=> {
        // so sánh với profile ID của mình => 
        return (
          <TouchableOpacity key={item._id} style={styles.messageItem}>
                <Image source={{ uri: item?.icon }} style={styles.avatar} />
                <View style={styles.messageContent}>
                    <View style={styles.messageText}>
                        <Text numberOfLines={1} style={styles.sender}>{item?.name}</Text>
                        <Text>da7</Text>
                    </View>
                    <Text style={styles.time}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                </View>
                
            </TouchableOpacity>
        );
        return (
            <View>

            </View>
        )
      }


     const renderMessageItem = ({ item }) => {
        
        return (
            <TouchableOpacity style={styles.messageItem}>
                <Image source={{ uri: item.background }} style={styles.avatar} />
                <View style={styles.messageContent}>
                    <View style={styles.messageText}>
                        <Text numberOfLines={1} style={styles.sender}>{item.name}</Text>
                        <Text>da7</Text>
                    </View>
                    <Text style={styles.time}>2:12pm</Text>
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
                data={channelList}
                keyExtractor={item => item._id}
                renderItem={rendermessit}
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
