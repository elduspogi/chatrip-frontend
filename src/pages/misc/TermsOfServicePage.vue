<script lang="ts" setup>
import FooterSection from '@/components/FooterSection.vue';
import { scrollToTop } from '@/lib/scroll-to-top';
import { termsOfServiceContents } from '@/texts';
import { RouterLink } from 'vue-router';

scrollToTop();
</script>

<template>
  <div class="px-1 md:px-30 lg:px-[250px] xl:px-[200px] 2xl:px-[600px]">
    <h1 class="font-bold text-2xl lg:text-5xl text-center pt-12 pb-8">Terms of Service</h1>
    <div class="border-4 bg-white mt-4 rounded-xl p-4">
      <h1 class="text-end"><span class="font-bold">Effective Date:</span> July 1, 2025</h1>
      <p class="py-4">Welcome to <span class="font-bold">Chatrip</span>! By accessing or using our website (the “Site”), you agree to comply with and be bound by the following Terms of Service. If you do not agree to these terms, please do not use our service.</p>
      <div
        v-for="(content, index) in termsOfServiceContents"
        :key="index"
        class="py-4"
      >
        <h1 class="font-bold">{{ index + 1 }}. {{ content.title }}</h1>
        <p>
          {{ content.text }}
          <RouterLink
            v-if="content.link"
            :to="content.link.path"
            class="font-bold underline text-[#5500FF]"
          >{{ content.link.label }}</RouterLink>
          {{ content.afterText }}
        </p>
      </div>
    </div>

    <FooterSection />
  </div>
</template>
