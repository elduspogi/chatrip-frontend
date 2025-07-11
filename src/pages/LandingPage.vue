<script setup lang="ts">
import Billboard from "@/assets/images/billboard.png";
import TextChatButton from "@/components/TextChatButton.vue";
import { landingePageContents } from "@/texts";
import { onMounted, ref } from "vue";

const interests = ref<string>('');
const storedInterest = ref<string[]>([]);

const error = ref<boolean>(false);
const errorMessage = ref<string>('');

// const videoError = ref<boolean>(false);

onMounted(() => {
  const rawInterests = localStorage.getItem('interests');
  storedInterest.value = rawInterests ? JSON.parse(rawInterests) : [];
});

function storeInterest() {

  if(interests.value === '') {
    error.value = true;
    errorMessage.value = 'Please enter an interest.';
    return;
  }

  if(storedInterest.value.includes(interests.value)) {
    error.value = true;
    errorMessage.value = 'Interest already given.'
    interests.value = '';
    return;
  }

  // Store interest to Local Storage
  storedInterest.value.push(interests.value);
  localStorage.setItem('interests', JSON.stringify(storedInterest.value));

  // Clean input
  interests.value = '';
  error.value = false;
}

function destroyInterest(index: number) {
  storedInterest.value.splice(index, 1);
  localStorage.setItem('interests', JSON.stringify(storedInterest.value));
}

function checkForMediaDevices() {
  const isMediaDevicesOn = sessionStorage.getItem('isMediaDevicesOn');
  if(isMediaDevicesOn === 'false' || isMediaDevicesOn === null) {
    error.value = true;
    errorMessage.value = 'Turn on your camera and microphone to access video chat.';

  }
}
</script>

<template>
  <div class="px-1 md:px-30 lg:px-[250px] xl:px-[400px] 2xl:px-[600px]">
    <div class="border-4 bg-white mt-4 rounded-xl p-4">
      <img class="w-full" :src=Billboard alt="Chatrip. Your chat, your trip.">

      <p
        :class="['pb-6', text.isWarning ? 'text-sm text-center' : '']"
        v-for="(text, index) in landingePageContents"
        :key="index"
      ><strong v-if="text.isTitle">Chatrip</strong> {{ text.text }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-[60%_40%]">
        <div class="mb-2 pr-2">
          <p class="text-center">What do you want to talk about?</p>

          <input
            @keyup.enter="storeInterest"
            v-model="interests"
            type="text"
            class="interest-input w-full border-4 rounded-md h-12 px-2 opacity-50 cursor-not-allowed"
            placeholder="Add your interest (optional)"
            disabled=true
          >

            <!-- Error Message -->
            <p v-if="error" class="text-sm text-red-600 pt-1">
              <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
              {{ errorMessage }}
            </p>

            <div class="flex flex-wrap gap-1 mt-2">
              <!-- Interests List -->
              <p
                v-for="(interest, index) in storedInterest"
                :key="index"
                class="bg-[#BBD3FF] hover:bg-[#FFB7CB] transition-colors duration-300 cursor-pointer px-5 py-1 text-sm rounded-xl"
                @click="destroyInterest(index)"
              >
                {{ interest }}
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </p>
            </div>
        </div>

        <div>
          <p class="text-center">Start chatting:</p>
          <div class="grid grid-cols-2 gap-1 items-center">
            <TextChatButton type="Text" path="/text" />
            <TextChatButton type="Video" path="/video" @click="checkForMediaDevices" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
