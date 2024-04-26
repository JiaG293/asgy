import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import SearchA from "../components/Search";
import socket from '../socket/socket'

import endpointAPI from "../api/endpointAPI";
import { setChannels, setCurrentChannel, setProfile } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { clientId, refreshToken } from "../auth/authStore";

export default function Chat({ navigation }) {
  const profile = useSelector((state) => state.profile);
  const profileID = profile?._id;
  const channelList = useSelector((state) => state.channelList);
  const dispatch = useDispatch();
  const [channelLoaded, setChannelLoaded] = useState(false);
  const messagesList = useSelector((state) => state.messagesList);

  // const { messages } = require('../data/mockChat');

  const fetchDataProfile = async () => {
    try {
      const headers = {
        
        "x-client-id": clientId,
        authorization: refreshToken,
      };

      const response = await axios.get(endpointAPI.getInfoProfile, {
        headers,
      });

      if (response.status === 200) {
        const profile = response.data.metadata;
        dispatch(setProfile(profile));
        setChannelLoaded(true);
      } else {
        console.error("Lỗi khi lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchDataChannel = async () => {
    try {
      const headers = {
        "x-client-id": clientId,
        authorization: refreshToken,
      };

      const response = await axios.get(endpointAPI.getListChannels, {
        headers,
      });


      if (response.status === 200) {
        const channelList = response.data.metadata;
        dispatch(setChannels(channelList));
      } else {
        console.error("Lỗi khi lấy thông tin channel");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin channel:", error);
    }
  };

  useLayoutEffect(() => {
    fetchDataProfile();
    fetchDataChannel();
  }, []);

  const handleSelectChannel =async (channel) => {
    // console.log(channel);
    dispatch(setCurrentChannel(channel));
    console.log(messagesList);
    // navigation.navigate("ChatScreen");
    await messagesList.forEach((item) => {
      console.log(1);
      // if (item.channelId === channel._id) {
        dispatch(setCurrentMessages(item.messages));
        console.log("message da chon");
        console.log(item);
      }
    // }
  );


  }

  // const selectChannel = async (channel) => {
  //   //hàm này để mất giao diện chờ
  //   setSelectedMessage(true);
  //   await IOLoadMessages();
  //   console.log(channel);
  //   dispatch(setCurrentChannel(channel));
  //   await messagesList.forEach((item) => {
  //     if (item.channelId === channel._id) {
  //       dispatch(setCurrentMessages(item.messages));
  //       console.log("message da chon");
  //       console.log(item);
  //     }
  //   });

  //   // console.log("MessageList");


  // };

  const renderMessages = ({ item }) => {
    // so sánh với profile ID của mình =>
    return (
      <TouchableOpacity key={item._id} style={styles.messageItem} onPress={() => { handleSelectChannel(item) }}>
        {item.typeChannel === 101 ? <Image source={{ uri: item?.icon }} style={styles.avatar} />
          : <Image source={{ uri: item?.iconGroup }} style={styles.avatar} />

        }
        <View style={styles.messageContent}>
          <View style={styles.messageText}>
            <Text numberOfLines={1} style={styles.sender}>
              {item?.name}
            </Text>
            <Text>da7</Text>
          </View>
          <Text style={styles.time}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return <View></View>;
  };

  const IOLoadMessages = async () => {
    await socket.emit("loadMessages", {
      senderId: profileID,
    });
    // console.log("đã load messages:::");
    // console.log(profileID);
  };

  useEffect(() => {
    const reRender = async () => {
      if (channelLoaded) {
        console.log(channelLoaded);
        console.log(profileID);
        // await IOAddUser();
        await IOLoadMessages();
        //hàm nhận tất cả tin nhắn từ lúc đầu
        
        socket.on("getMessages", (data) => {
          console.log(data);
          dispatch(setMessages(data));
        });

        socket.on("messageRevoked", data=>{
          console.log("đã thu hồi", data);
        })
      }
    };

    reRender();
  }, [ channelLoaded]);


  return (
    <View style={styles.container}>
      <View>
        <SearchA />
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={channelList}
        keyExtractor={(item) => item._id}
        renderItem={renderMessages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  messageItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  messageText: {
    flex: 1,
  },
  sender: {
    fontWeight: "bold",
  },
  time: {
    alignSelf: "center",
    color: "#999",
  },
});
