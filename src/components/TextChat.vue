<script setup lang="ts">
import { textChatSocket } from '@/lib/text-chat-socket';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const {
  socket,
  message,
  confirm,
  userId,
  conversation,
  isQueueing,
  isTyping,
  isMatched,
  sendMessage,
  debouncedTyping,
  options,
  isDisconnected
} = textChatSocket();

const emit = defineEmits(['pass-socket']);

onMounted(() => {
  emit('pass-socket', socket);
});

const route = useRoute();

onUnmounted(() => {
  // clean the boolean values
  conversation.value = [];
  isDisconnected.value.isDisconnected = false;

  socket.emit('fire-disconnection', { socketId: socket.id, chatType: route.name });

  socket.disconnect();
});
</script>

<template>
  <section class="h-[93vh] md:h-[88vh] xl:h-[90vh] grid grid-rows-[1fr_auto] gap-2 p-2">
    <div class="bg-white border-4 rounded-xl p-1 overflow-y-auto">
      <p class="font-bold">
        {{ isQueueing ? 'Looking for stranger...' : isMatched ? "You're now chatting with a random stranger.": 'Matching stopped.' }}
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

      <p
        v-if="isDisconnected.isDisconnected"
        class="font-bold"
      >{{ isDisconnected.userId === userId ? 'You' : 'Stranger has' }} disconnected.</p>
    </div>

    <div class="flex gap-1">
      <button
        class="bg-[#FFB7CB] hover:bg-[#ff7fa3] transition-colors duration-500 px-4 py-4 lg:px-10 lg:py-5 xl:px-20 xl:py-10 border-4 rounded-md cursor-pointer"
        @click="options"
        @keyup.esc="options"
      >
        <p class="text-sm lg:text-lg font-bold">{{ isQueueing ? 'Stop' :  isMatched ? confirm ? 'Sure?' : 'New' : 'New' }}</p>

        <span class="hidden md:block text-[12px]">Esc</span>
      </button>

      <input type="text"
        v-model="message"
        :class="['border-4 rounded-md w-full p-1 bg-white placeholder:text-sm placeholder:md:text-lg', isQueueing || isDisconnected.isDisconnected || !isMatched ? 'opacity-75 cursor-no-drop' : '']"
        placeholder="Enter message..."
        @keyup.enter="sendMessage"
        @input="debouncedTyping"
        :disabled="isQueueing || isDisconnected.isDisconnected || !isMatched"
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
