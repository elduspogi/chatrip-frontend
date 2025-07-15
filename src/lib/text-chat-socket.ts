import type { Message, User } from '@/types';
import { debounce } from 'lodash';
import { ref } from 'vue';
// import { peer } from './peer-instance';
import { useRoute } from 'vue-router';
import { peer, socket } from './peer-instance';

const message = ref<string>('');
const confirm = ref<boolean>(false);
const userId = ref<string>('');
const conversation = ref<Message[]>([]);
const roomId = ref<string>('');
const isQueueing = ref<boolean>(false);
const isTyping = ref<boolean>(false);
const isMatched = ref<boolean>(false);
const isDisconnected = ref<{
  userId: string,
  isDisconnected: boolean
}>({ userId: '', isDisconnected: false });
const peerIds = ref<{
  userPeerId: string;
  strangerPeerId: string;
}>();
const peerId = ref<string>('');
const isLoading = ref<boolean>(false);

export function textChatSocket() {
  // Get userId on page load
  socket.on('send-user-id', (data: User) => {
    userId.value = data.userId;
    isQueueing.value = true;
  })

  // Listen to server
  socket.on('ping', (data: Message) => {
    conversation.value.push(data);
  });

  function bootPeer() {
    peer.on('open', (id) => {
      peerId.value = id;

      // boot this func on page load
      findPartner();
    });
  }

  const route = useRoute();

  if (route.name === 'video') {
    bootPeer();
  } else {
    findPartner();
  }

  function findPartner() {
    socket.emit('find-partner', { peerId: peerId.value, chatType: route.name }, () => {
      console.log('Matching...');
      isQueueing.value = true;
    });
  }

  socket.on('matched', (data: { roomId: string, partnerId: string, userPeerId: string, strangerPeerId: string }) => {
    isQueueing.value = false;
    roomId.value = data.roomId;
    isMatched.value = true;

    peerIds.value = { userPeerId: data.userPeerId, strangerPeerId: data.strangerPeerId }

    if(route.name === 'video') isLoading.value = true

    console.log('matched is firing')
  })

  // Listen to typing
  socket.on('fire-typing', (data: { userId: string, isTyping: boolean }) => {
    if (data.userId !== userId.value) {
      isTyping.value = data.isTyping;
    }
  })

  // listen for disconnection
  socket.on('notify-disconnection', (data: { userId: string; isDisconnected: boolean }) => {
    isDisconnected.value = {
      userId: data.userId,
      isDisconnected: data.isDisconnected
    }

    isTyping.value = false;
    socket.disconnect();
  })

  function confirmNew() {
    if(!confirm.value) {
      confirm.value = true;
    } else {
      console.log("You left the conversation.");

      // Handle Logic for User Disconnection
      userDisconnect();

      confirm.value = false;

      isTyping.value = false;
    }
  }

  function stopQueueing() {
    // stop the queueing
    if(!isQueueing.value) {
      isQueueing.value = true;
    } else {
      isQueueing.value = false;
    }

    socket.emit('stop-queueing', { chatType: route.name });
  }

  function matchAgain() {
    isMatched.value = false;
    isQueueing.value = true;

    socket.connect();

    // bootPeer();
    if (route.name === 'text') {
      findPartner()
    } else {
      bootPeer()
      findPartner()
    }

    conversation.value = [];

    isDisconnected.value.isDisconnected = false;
  }

  function sendMessage() {
    if(message.value === '') return;

    // Talk to server
    socket.emit('send-message', {
      userId: userId.value,
      roomId: roomId.value,
      message: message.value,
    })

    message.value = '';

    // No debounce here to instant change the state of the isTyping
    fireTyping();
  }

  // Sends to the backend that a user is typing
  function fireTyping() {
    socket.emit('fire-typing', {
      userId: userId.value,
      roomId: roomId.value,
      isTyping: message.value.length > 0
    })
  }

  // Debounce the firing func by n seconds
  const debouncedTyping = debounce(fireTyping, 1000);

  function userDisconnect() {
    // socket.on('fire-disconnection', { userId: userId, roomId: roomId.value });
    socket.disconnect();
    isDisconnected.value.userId = userId.value;
    isDisconnected.value.isDisconnected = true;
  }

  function options() {
    return isQueueing.value ? stopQueueing() : isDisconnected.value.isDisconnected ? matchAgain() : isMatched.value ? confirmNew() : matchAgain()
  }

  return {
    socket,
    message,
    confirm,
    userId,
    conversation,
    roomId,
    isQueueing,
    isTyping,
    isMatched,
    sendMessage,
    debouncedTyping,
    options,
    isDisconnected,
    bootPeer,
    isLoading
  }
}
