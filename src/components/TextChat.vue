<script setup lang="ts">
import { ref } from 'vue';

const message = ref<string>('');
const confirm = ref<boolean>(false);

function confirmNew() {
  if(!confirm.value) {
    confirm.value = true;
  } else {
    console.log("You left the conversation.");

    // POST Request End Conversation

    confirm.value = false;
  }
}

function sendMessage() {
  console.log(message.value);

  // POST Request prolly axios

  message.value = '';
}
</script>

<template>
  <section class="h-[93vh] md:h-[88vh] xl:h-[90vh] grid grid-rows-[1fr_auto] gap-2 p-2">
    <div class="bg-white border-4 rounded-xl">

    </div>

    <div class="flex gap-1">
      <button
        class="bg-[#FFB7CB] hover:bg-[#ff7fa3] transition-colors duration-500 px-4 py-4 lg:px-10 lg:py-5 xl:px-20 xl:py-10 border-4 rounded-md cursor-pointer"
        @click="confirmNew"
      >
        <p class="text-sm lg:text-lg font-bold">{{ confirm ? 'Sure?' : 'New' }}</p>
        <span class="hidden md:block text-[12px]">Esc</span>
      </button>

      <input type="text"
        v-model="message"
        class="border-4 rounded-md w-full p-1 bg-white placeholder:text-sm placeholder:md:text-lg"
        placeholder="Enter message..."
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
