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
  isDisconnected,
  isLoading
} = textChatSocket();

const route = useRoute();

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isLoading.value === false) {
      options()
    }
  })
})

onUnmounted(() => {
  // clean the boolean values
  conversation.value = [];
  isDisconnected.value.isDisconnected = false;

  socket.emit('fire-disconnection', { socketId: socket.id, chatType: route.name });

  socket.disconnect();
});

function downloadConversation() {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="icon" href="/favicon.ico">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatrip</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

            body {
                background-color: #ECE0D1;
                font-family: "Nunito", sans-serif;
            }

            section {
                background-color: white;
                margin: 12px 6px;
                height: 95vh;
                border: 4px solid black;
                border-radius: 12px;
                padding: 6px;
            }

            p {
              margin: 0;
            }

            .chat {
                font-weight: bold;
            }

            .you {
                color: #1E88E5;
            }

            .stranger {
                color: #E53935;
            }
        </style>
      </head>
      <body>
        <section>
            <!-- populate conversations here -->
            ${conversation.value.map(chat => `
              <p>
                <span class="chat ${chat.userId === userId.value ? 'you' : 'stranger'}">
                  ${chat.userId === userId.value ? 'You: ' : 'Stranger: '}
                </span>
                ${chat.message}
              </p>
            `).join('')}
        </section>
      </body>
    </html>
  `

  const blob = new Blob([template], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  if(conversation)

  a.href = url
  a.download = 'conversation.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  console.log(template)
}
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
        v-show="isTyping"
        class="font-bold"
      >Stranger is typing...</p>

      <div
        v-show="isDisconnected.isDisconnected"
      >
        <p
          class="font-bold"
        >{{ isDisconnected.userId === userId ? 'You' : 'Stranger has' }} disconnected.</p>

        <div class="flex items-center gap-2">
          <button
            class="md:text-xl text-white px-4 py-2 md:px-12 md:py-4 my-2 rounded-lg bg-gradient-to-b from-[#BBD3FF] via-[#5f97ff] to-[#5f97ff] duration-500 cursor-pointer"
            @click="options"
          >New chat</button>
          <p>
            or
              <a :href="route.name === 'video' ? '/text' : '/video'" class="underline font-bold text-[#5500FF]">
                switch to {{ route.name === 'video' ? 'text' : 'video' }}
              </a>
          </p>
        </div>

        <p class="font-bold" v-show="conversation.length > 0">
          Had fun? Download the conversation
          <span
            class="underline font-bold text-[#5500FF] cursor-pointer"
            @click="downloadConversation">here</span>.
          </p>
      </div>
    </div>

    <div class="flex gap-1">
      <button
        :class="['bg-[#FFB7CB] hover:bg-[#ff7fa3] transition-colors duration-500 px-4 py-4 lg:px-10 lg:py-5 xl:px-20 xl:py-10 border-4 rounded-md cursor-pointer', isLoading ? 'opacity-75' : '']"
        @click="options"
        :disabled=isLoading
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
