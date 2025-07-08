<script setup lang="ts">
import FooterSection from '@/components/FooterSection.vue';
import NavBar from '@/components/NavBar.vue';
import { scrollToTop } from '@/lib/scroll-to-top';
import { ref } from 'vue';

const showArrowTop = ref<boolean>(false);

window.addEventListener('scroll', checkHeight);

function checkHeight() {
  if(window.scrollY > 50) {
    showArrowTop.value = true;
  } else {
    showArrowTop.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>

    <FooterSection />

    <!-- Go To Top Button -->
    <div
      :class="['fixed bottom-5 right-5 px-3 py-2 bg-[#FFB7CB] border-[3px] border-[#000] hover:cursor-pointer hover:bg-[#ff7fa3] rounded-lg transition-colors duration-500', showArrowTop ? 'block' : 'hidden']"
      @click="scrollToTop"
    >
      <font-awesome-icon :icon="['fas', 'arrow-up']" />
    </div>
  </div>
</template>
