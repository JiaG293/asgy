import React from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import SearchA from '../components/Search';

const { messages } = require('../data/mockChat')

export default function Chat() {
    const renderMessageItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.messageItem}>
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
