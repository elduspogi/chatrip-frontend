<script setup lang="ts">
import type { Message, User } from '@/types';
import { debounce } from 'lodash';
import { io, Socket } from 'socket.io-client';
import { onMounted, ref } from 'vue';

const message = ref<string>('');
const confirm = ref<boolean>(false);
const userId = ref<string>('');
const conversation = ref<Message[]>([]);
const roomId = ref<string>('');
const isQueueing = ref<boolean>(false);
const isTyping = ref<boolean>(false);

let socket: Socket;

onMounted(() => {
  // Init Socket
  socket = io(import.meta.env.VITE_URL, {
    transports: ['websocket'],
  });

  // Get userId on page load
  socket.on('send-user-id', (data: User) => {
    userId.value = data.userId;
    isQueueing.value = data.isQueueing;
  })

  // Listen to server
  socket.on('ping', (data: Message) => {
    conversation.value.push(data);
  });

  // Look for partner
  socket.emit('find-partner', (data: { isQueueing: boolean }) => {
    console.log('Matching...');
    isQueueing.value = data.isQueueing;
  })

  socket.on('matched', (data: { roomId: string, partnerId: string, isQueueing: boolean }) => {
    isQueueing.value = data.isQueueing;
    roomId.value = data.roomId;
  })

  // Listen to typing
  socket.on('fire-typing', (data: { userId: string, isTyping: boolean }) => {
    if (data.userId !== userId.value) {
      isTyping.value = data.isTyping;
    }
  })
})

function confirmNew() {
  if(!confirm.value) {
    confirm.value = true;
  } else {
    console.log("You left the conversation.");

    // Handle Logic for User Disconnection
    confirm.value = false;
  }
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
</script>

<template>
  <section class="h-[93vh] md:h-[88vh] xl:h-[90vh] grid grid-rows-[1fr_auto] gap-2 p-2">
    <div class="bg-white border-4 rounded-xl p-1 overflow-y-auto">
      <p class="font-bold">
        {{ isQueueing ? 'Looking for stranger...' : "You're now chatting with a random stranger." }}
      </p>

      <p
        v-for="(chat, index) in conversation"
        :key="index"
      >
        <span :class="['font-bold', chat.userId === userId ? 'text-blue-600' : 'text-red-600']">
          {{ chat.userId === userId ? 'You' : 'Stranger' }}:</span>
          {{ chat.message }}
      </p>

      <p
        v-if="isTyping"
        class="font-bold"
      >Stranger is typing...</p>
    </div>

    <div class="flex gap-1">
      <button
        class="bg-[#FFB7CB] hover:bg-[#ff7fa3] transition-colors duration-500 px-4 py-4 lg:px-10 lg:py-5 xl:px-20 xl:py-10 border-4 rounded-md cursor-pointer"
        @click="() => isQueueing ? confirmNew : sendMessage"
      >
        <p class="text-sm lg:text-lg font-bold">{{ confirm ? 'Sure?' : 'New' }}</p>
        <span class="hidden md:block text-[12px]">Esc</span>
      </button>

      <input type="text"
        v-model="message"
        :class="['border-4 rounded-md w-full p-1 bg-white placeholder:text-sm placeholder:md:text-lg', isQueueing ? 'opacity-75' : '']"
        placeholder="Enter message..."
        @keyup.enter="sendMessage"
        @input="debouncedTyping"
        :disabled="isQueueing"
      >

      <button
        :class="['bg-[#BBD3FF] transition-colors duration-500 px-4 py-4 lg:px-10 lg:py-5 xl:px-20 xl:py-10 border-4 rounded-md', message === '' ? 'opacity-70 cursor-no-drop': 'hover:bg-[#5f97ff] cursor-pointer']"
        @click="sendMessage"
        :disabled="message === ''"
      >
        <p class="text-sm lg:text-lg font-bold">Send</p>
        <span class="hidden md:block text-[12px]">Enter</span>
      </button>
    </div>
  </section>
</template>
