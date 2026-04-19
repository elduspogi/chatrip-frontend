import type { Message, User } from '@/types';
import { debounce } from 'lodash';
import { ref } from 'vue';
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
  userId: string;
  isDisconnected: boolean;
}>({ userId: '', isDisconnected: false });
const peerIds = ref<{
  userPeerId: string;
  strangerPeerId: string;
}>();
const peerId = ref<string>('');
export const isLoading = ref<boolean>(false);
export const isSelfDisconnected = ref<boolean>(false);
export const isPartnerDisconnected = ref<boolean>(false);

let isInitialized = false; // 👈 module level so it survives re-calls

// =========================
// SOCKET LISTENERS (registered once at module level)
// =========================
socket.on('ping', (data: Message) => {
  conversation.value.push(data);
});

socket.on('fire-typing', (data: { userId: string; isTyping: boolean }) => {
  if (data.userId !== userId.value) {
    isTyping.value = data.isTyping;
  }
});

// =========================
// COMPOSABLE
// =========================
export function textChatSocket(chatType?: string) {

  function findPartner() {
    const interests = localStorage.getItem('interests');
    console.log('[findPartner] emitting | socket connected:', socket.connected, '| peerId:', peerId.value, '| chatType:', chatType);
    socket.emit('find-partner', { peerId: peerId.value, chatType, interests }, () => {
      isQueueing.value = true;
    });
  }

  function bootPeer() {
    console.log('[bootPeer] called | peer state:', peer.disconnected, peer.destroyed);
    peer.removeAllListeners('open');

    // 👇 if peer is already open, just use the existing ID
    if (!peer.disconnected && !peer.destroyed && peer.id) {
      console.log('[bootPeer] peer already open | id:', peer.id);
      peerId.value = peer.id;
      findPartner();
      return;
    }

    peer.on('open', (id) => {
      console.log('[bootPeer] peer open | id:', id);
      peerId.value = id;
      findPartner();
    });
  }

  function matchAgain() {
    console.log('[matchAgain] called | socket connected:', socket.connected);
    isMatched.value = false;
    isQueueing.value = true;
    isPartnerDisconnected.value = false;
    isSelfDisconnected.value = false;
    conversation.value = [];
    isDisconnected.value.isDisconnected = false;
    isTyping.value = false;
    confirm.value = false;

    // 👇 if socket is still connected (partner left, not us), just find partner directly
    if (socket.connected) {
      if (chatType === 'video') {
        bootPeer();
      } else {
        findPartner();
      }
      return;
    }

    // socket was disconnected (we left), need to reconnect first
    socket.once('connect', () => {
      userId.value = socket.id ?? '';
      if (chatType === 'video') {
        bootPeer();
      } else {
        findPartner();
      }
    });
    socket.connect();
  }

  function confirmNew() {
    if (!confirm.value) {
      confirm.value = true;
    } else {
      userDisconnect();
      confirm.value = false;
      isTyping.value = false;
    }
  }

  function stopQueueing() {
    isQueueing.value = false;
    socket.emit('stop-queueing', { chatType });
  }

  function userDisconnect() {
    socket.emit('stop-queueing', { chatType });
    socket.disconnect();
    isDisconnected.value.userId = userId.value;
    isDisconnected.value.isDisconnected = true;
    isSelfDisconnected.value = true;
  }

  function sendMessage() {
    if (message.value === '') return;
    socket.emit('send-message', {
      userId: userId.value,
      roomId: roomId.value,
      message: message.value,
    });
    message.value = '';
    fireTyping();
  }

  function fireTyping() {
    socket.emit('fire-typing', {
      userId: userId.value,
      roomId: roomId.value,
      isTyping: message.value.length > 0,
    });
  }

  const debouncedTyping = debounce(fireTyping, 1000);

  function options() {
    return isQueueing.value
      ? stopQueueing()
      : isDisconnected.value.isDisconnected || isPartnerDisconnected.value
      ? matchAgain()
      : isMatched.value
      ? confirmNew()
      : matchAgain();
  }

  // =========================
  // INIT
  // =========================
  socket.off('send-user-id');
  socket.on('send-user-id', (data: User) => {
    userId.value = data.userId;
    isQueueing.value = true;

    if (isInitialized) return; // 👈 only auto-find on first load, matchAgain handles the rest
    isInitialized = true;

    if (chatType === 'video') {
      bootPeer();
    } else {
      findPartner();
    }
  });

  socket.off('matched');
  socket.on('matched', (data: { roomId: string; userPeerId: string; strangerPeerId: string }) => {
    isQueueing.value = false;
    roomId.value = data.roomId;
    isMatched.value = true;
    isPartnerDisconnected.value = false;
    peerIds.value = { userPeerId: data.userPeerId, strangerPeerId: data.strangerPeerId };
    if (chatType === 'video') isLoading.value = true;
  });

  socket.off('notify-disconnection');
  socket.on('notify-disconnection', (data: { userId: string; isDisconnected: boolean }) => {
    isDisconnected.value = {
      userId: data.userId,
      isDisconnected: data.isDisconnected,
    };
    isTyping.value = false;
    if (chatType !== 'video') {
      socket.disconnect();
    }
  });

  socket.off('partner-disconnected');
  socket.on('partner-disconnected', () => {
    if (chatType !== 'video') return;
    isPartnerDisconnected.value = true;
    isTyping.value = false;
    isLoading.value = false;
    conversation.value = [];
  });

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
    isLoading,
    isPartnerDisconnected,
  };
}
